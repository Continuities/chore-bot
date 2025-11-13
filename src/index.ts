import {
	CHORE_CRON,
	DISCORD_CHANNEL,
	DISCORD_TOKEN,
	MONGODB_PASSWORD,
	MONGODB_URI,
	MONGODB_USER,
	RECYCLING_CRON,
	TRASH_CRON
} from './config';
import cron from 'node-cron';
import ChoresModel from './model/chores';
import ChoreMessagesModel from './model/chore-messages';
import DiscordInterface from './discord-interface';
import MongoDBPersistor from './mongodb-persistor';

(async () => {
	// Initialise persistors
	const useMongo = MONGODB_URI && MONGODB_USER && MONGODB_PASSWORD;
	const mongo = useMongo
		? await MongoDBPersistor({
				uri: MONGODB_URI as string,
				username: MONGODB_USER as string,
				password: MONGODB_PASSWORD as string
		  })
		: undefined;

	// Initialise models and interfaces, injecting persistors where available
	const model = ChoresModel({
		states: mongo ? await mongo.getChores() : undefined,
		assignments: mongo ? await mongo.getChoreAssignments() : undefined,
		onAssign: mongo?.assignChore,
		onComplete: mongo?.completeChore
	});
	const choreMessages = ChoreMessagesModel({
		messages: mongo ? await mongo.getChoreMessages() : undefined,
		onAdd: mongo?.addChoreMessage,
		onDelete: mongo?.removeChoreMessage
	});
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
		});
	} else {
		console.log('Trash reminders are disabled');
	}

	// Remind us to take out the recycling
	if (RECYCLING_CRON) {
		cron.schedule(RECYCLING_CRON, () => {
			discord.announce(`Hey @everyone, it's time to take out the recycling and compost! ♻️`);
		});
	} else {
		console.log('Recycling reminders are disabled');
	}
})();
