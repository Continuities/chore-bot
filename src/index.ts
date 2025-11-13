import { ChannelType, Client, TextChannel, userMention } from 'discord.js';
import Commands from './commands';
import { CHORE_CRON, DISCORD_CHANNEL, DISCORD_TOKEN, RECYCLING_CRON, TRASH_CRON } from './config';
import deployCommands from './deploy-commands';
import cron from 'node-cron';
import { assignChores } from './chore-engine';
import ChoresModel, { getChoreDescription } from './model/chores';
import { withoutTime } from './date';

const CONFIRM_EMOJI = '✅';

const model = ChoresModel();

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
		Commands[commandName as keyof typeof Commands].execute(model, interaction).catch(console.error);
	}
});

client.on('messageReactionAdd', (messageReaction, user) => {
	const { message, emoji } = messageReaction;
	const chore = choreMessages.get(message.id);
	if (!chore || emoji.name !== CONFIRM_EMOJI) return;

	if (message.channel.isSendable()) {
		message.react(`🎉`).catch(console.error);
	}

	model.markChoreCompleted(chore.choreId, user.id, withoutTime(new Date()));
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
const assignAndAnnounceChores = () => {
	console.log('Assining and announcing chores for today');

	const chores = assignChores(model);
	if (chores.length === 0) {
		return;
	}

	inChannel((channel) => {
		chores.forEach((chore) => {
			const description = getChoreDescription(chore.choreId);
			const mention = userMention(chore.assignedTo);
			channel
				.send(
					`${mention} it's your turn to ${description}!\nReact with ${CONFIRM_EMOJI} when complete.`
				)
				.then((message) => {
					choreMessages.set(message.id, chore);
				})
				.catch(console.error);
		});
	});
};

// Assign and acounce chores if necessary
if (CHORE_CRON) {
	cron.schedule(CHORE_CRON, assignAndAnnounceChores);
} else {
	console.log('Chore announcements are disabled');
}

// Remind us to take out the trash
if (TRASH_CRON) {
	cron.schedule(TRASH_CRON, () => {
		inChannel((channel) => {
			channel.send(`Hey @everyone, it's time to take out the trash! 🗑️`).catch(console.error);
		});
	});
} else {
	console.log('Trash reminders are disabled');
}

// Remind us to take out the recycling
if (RECYCLING_CRON) {
	cron.schedule(RECYCLING_CRON, () => {
		inChannel((channel) => {
			channel
				.send(`Hey @everyone, it's time to take out the recycling and compost! ♻️`)
				.catch(console.error);
		});
	});
} else {
	console.log('Recycling reminders are disabled');
}

client.login(DISCORD_TOKEN);
