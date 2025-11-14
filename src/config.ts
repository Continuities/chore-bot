import dotenv from 'dotenv';

dotenv.config({
	path: `.env${process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ''}`
});

const {
	DISCORD_TOKEN,
	DISCORD_CLIENT_ID,
	DISCORD_CHANNEL,
	ANNOUNCE_CHORES,
	WARNING_DAYS,
	CHORE_CRON,
	TRASH_CRON,
	RECYCLING_CRON,
	MONGODB_URI,
	MONGODB_DB,
	MONGODB_USER,
	MONGODB_PASSWORD
} = process.env;

if (!DISCORD_TOKEN) {
	throw new Error('Missing DISCORD_TOKEN in environment variables');
}

if (!DISCORD_CLIENT_ID) {
	throw new Error('Missing DISCORD_CLIENT_ID in environment variables');
}

if (!DISCORD_CHANNEL) {
	throw new Error('Missing DISCORD_CHANNEL in environment variables');
}

if (!MONGODB_URI || MONGODB_DB || !MONGODB_USER || !MONGODB_PASSWORD) {
	console.log('Missing MongoDB configuration. State will not be persisted.');
}

const ANNOUNCE_CHORES_BOOL = ANNOUNCE_CHORES?.toLowerCase() === 'true';
const WARNING_DAYS_NUM = WARNING_DAYS ? parseInt(WARNING_DAYS, 10) : 0;

export {
	DISCORD_TOKEN,
	DISCORD_CLIENT_ID,
	DISCORD_CHANNEL,
	ANNOUNCE_CHORES_BOOL as ANNOUNCE_CHORES,
	WARNING_DAYS_NUM as WARNING_DAYS,
	CHORE_CRON,
	TRASH_CRON,
	RECYCLING_CRON,
	MONGODB_URI,
	MONGODB_DB,
	MONGODB_USER,
	MONGODB_PASSWORD
};
