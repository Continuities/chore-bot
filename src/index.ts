import { ChannelType, Client, TextChannel, userMention } from 'discord.js';
import Commands from './commands';
import { ANNOUNCE_CHORES, DISCORD_CHANNEL, DISCORD_TOKEN } from './config';
import deployCommands from './deploy-commands';
import cron from 'node-cron';
import { getCurrentChores } from './chore-engine';
import { getChoreDescription } from './model/chore';

const CONFIRM_EMOJI = '✅';

const client = new Client({
	intents: ['Guilds', 'GuildMessages', 'GuildMessageReactions', 'DirectMessages']
});

client.once('ready', () => {
	console.log('Chorebot is ready! 🤖');
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
		Commands[commandName as keyof typeof Commands].execute(interaction);
	}
});

client.on('messageReactionAdd', (messageReaction, user) => {
	const { message, emoji } = messageReaction;
	const chore = choreMessages.get(message.id);
	if (!chore || emoji.name !== CONFIRM_EMOJI) return;

	if (message.channel.isSendable()) {
		message.reply(`Thanks ${userMention(user.id)}! 🎉`);
	}

	choreMessages.delete(message.id);
});

const inChannel = (fn: (channel: TextChannel) => void) => {
	client.guilds.cache.forEach((guild) => {
		guild.channels.cache
			.filter((channel) => channel.type === ChannelType.GuildText)
			.filter((channel) => channel.name === DISCORD_CHANNEL)
			.forEach(fn);
	});
};

const choreMessages: Map<string, ChoreAssignment> = new Map();
const announceChores = () => {
	console.log('Announcing chores for today');

	const chores = getCurrentChores();
	if (chores.length === 0) {
		return;
	}

	inChannel((channel) => {
		chores.forEach((chore) => {
			const description = getChoreDescription(chore.choreId);
			const mention = userMention(chore.assignedTo);
			channel
				.send(
					`${mention} it's your turn to ${description}! React with ${CONFIRM_EMOJI} when complete.`
				)
				.then((message) => {
					choreMessages.set(message.id, chore);
				})
				.catch(console.error);
		});
	});
};

// Acounce chores every day at noon, if there are any
if (ANNOUNCE_CHORES) {
	cron.schedule('0 12 * * *', announceChores);
} else {
	console.log('Chore announcements are disabled');
}

// Remind us to take out the trash every Wednesday at 22h
cron.schedule('0 22 * * 3', () => {
	inChannel((channel) => {
		channel.send(`Hey @everyone, it's time to take out the trash! 🗑️`);
	});
});

// Remind us to take out the recycling every Sunday at 22h
cron.schedule('0 22 * * 7', () => {
	inChannel((channel) => {
		channel.send(`Hey @everyone, it's time to take out the recycling and compost! ♻️`);
	});
});

client.login(DISCORD_TOKEN);
