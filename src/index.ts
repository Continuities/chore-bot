import { CHORE_CRON, DISCORD_CHANNEL, DISCORD_TOKEN, RECYCLING_CRON, TRASH_CRON } from './config';
import cron from 'node-cron';
import ChoresModel from './model/chores';
import ChoreMessagesModel from './model/chore-messages';
import DiscordInterface from './discord-interface';

// Load chores and assignments from storage
// TODO

const model = ChoresModel();
const choreMessages = ChoreMessagesModel();
const discord = DiscordInterface({
	token: DISCORD_TOKEN,
	channel: DISCORD_CHANNEL,
	choreModel: model,
	choreMessagesModel: choreMessages
});

// Assign and acounce chores if necessary
if (CHORE_CRON) {
	cron.schedule(CHORE_CRON, discord.assignAndAnnounceChores);
} else {
	console.log('Chore announcements are disabled');
}

// Remind us to take out the trash
if (TRASH_CRON) {
	cron.schedule(TRASH_CRON, () => {
		discord.announce(`Hey @everyone, it's time to take out the trash! 🗑️`);
		// inChannel((channel) => {
		// 	channel.send(`Hey @everyone, it's time to take out the trash! 🗑️`).catch(console.error);
		// });
	});
} else {
	console.log('Trash reminders are disabled');
}

// Remind us to take out the recycling
if (RECYCLING_CRON) {
	cron.schedule(RECYCLING_CRON, () => {
		discord.announce(`Hey @everyone, it's time to take out the recycling and compost! ♻️`);
		// inChannel((channel) => {
		// 	channel
		// 		.send(`Hey @everyone, it's time to take out the recycling and compost! ♻️`)
		// 		.catch(console.error);
		// });
	});
} else {
	console.log('Recycling reminders are disabled');
}
