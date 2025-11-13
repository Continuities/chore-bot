declare global {
	interface DiscordInterfaceInit {
		token: string | undefined;
		channel: string | undefined;
		choreModel: ChoresModelType;
		choreMessagesModel: ChoreMessagesModelType;
		confirmEmoji?: string;
	}
}

import { ChannelType, Client, TextChannel, userMention } from 'discord.js';
import { assignChores } from './chore-engine';
import { withoutTime } from './date';
import deployCommands from './deploy-commands';
import { getChoreDescription } from './model/chores';
import Commands from './commands';

const DiscordInterface = ({
	token,
	channel,
	choreModel,
	choreMessagesModel,
	confirmEmoji = '✅'
}: DiscordInterfaceInit) => {
	const client = new Client({
		intents: ['Guilds', 'GuildMessages', 'GuildMessageReactions', 'DirectMessages']
	});

	client.once('ready', () => {
		// Fetch chore messages from Discord to restore cache to ensure
		// that we will see reactions to all of them
		Promise.all(
			choreMessagesModel.all().map(async (choreMessage) => {
				try {
					const guild = await client.guilds.fetch(choreMessage.guildId);
					const channel = await guild.channels.fetch(choreMessage.channelId);
					if (channel?.isTextBased()) {
						await channel.messages.fetch(choreMessage.messageId);
					}
				} catch (error) {
					console.error(`Failed to fetch message ${choreMessage.messageId}:`, error);
				}
			})
		).then(() => {
			console.log('Chorebot is ready! 🤖');
		});
	});

	client.on('guildCreate', async (guild) => {
		await deployCommands({ guildId: guild.id });
	});

	client.on('interactionCreate', async (interaction) => {
		if (!interaction.isCommand()) {
			return;
		}
		const { commandName } = interaction;
		if (Commands[commandName as keyof typeof Commands]) {
			Commands[commandName as keyof typeof Commands]
				.execute(choreModel, interaction)
				.catch(console.error);
		}
	});

	client.on('messageReactionAdd', (messageReaction, user) => {
		const { message, emoji } = messageReaction;
		const chore = choreMessagesModel.get(message.id);
		if (!chore || emoji.name !== confirmEmoji) return;

		if (message.channel.isSendable()) {
			message.react(`🎉`).catch(console.error);
		}

		choreModel.markChoreCompleted(chore.choreId, user.id, withoutTime(new Date()));
		choreMessagesModel.delete(message.id);
	});

	const inChannel = (fn: (channel: TextChannel) => void) => {
		client.guilds.cache.forEach((guild) => {
			guild.channels.cache
				.filter((c) => c.type === ChannelType.GuildText)
				.filter((c) => c.name === channel)
				.forEach(fn);
		});
	};

	const assignAndAnnounceChores = () => {
		console.log('Assining and announcing chores for today');

		const chores = assignChores(choreModel);
		if (chores.length === 0) {
			return;
		}

		inChannel((channel) => {
			chores.forEach((chore) => {
				const description = getChoreDescription(chore.choreId);
				const mention = userMention(chore.assignedTo);
				channel
					.send(
						`${mention} it's your turn to ${description}!\nReact with ${confirmEmoji} when complete.`
					)
					.then((message) => {
						choreMessagesModel.add({
							choreId: chore.choreId,
							guildId: channel.guildId,
							channelId: channel.id,
							messageId: message.id
						});
					})
					.catch(console.error);
			});
		});
	};

	client.login(token);

	return {
		assignAndAnnounceChores,
		announce: (text: string) => {
			inChannel((channel) => {
				channel.send(text).catch(console.error);
			});
		}
	};
};

export default DiscordInterface;
