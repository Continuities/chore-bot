import dotenv from 'dotenv';

dotenv.config();

const { DISCORD_TOKEN, DISCORD_CLIENT_ID, DISCORD_CHANNEL, ANNOUNCE_CHORES } = process.env;

if (!DISCORD_TOKEN) {
	throw new Error('Missing DISCORD_TOKEN in environment variables');
}

if (!DISCORD_CLIENT_ID) {
	throw new Error('Missing DISCORD_CLIENT_ID in environment variables');
}

if (!DISCORD_CHANNEL) {
	throw new Error('Missing DISCORD_CHANNEL in environment variables');
}

const ANNOUNCE_CHORES_BOOL = ANNOUNCE_CHORES?.toLowerCase() === 'true';

export {
	DISCORD_TOKEN,
	DISCORD_CLIENT_ID,
	DISCORD_CHANNEL,
	ANNOUNCE_CHORES_BOOL as ANNOUNCE_CHORES
};
