import dotenv from 'dotenv';

dotenv.config();

const { DISCORD_TOKEN, DISCORD_CLIENT_ID, DISCORD_CHANNEL } = process.env;

if (!DISCORD_TOKEN) {
	throw new Error('Missing DISCORD_TOKEN in environment variables');
}

if (!DISCORD_CLIENT_ID) {
	throw new Error('Missing DISCORD_CLIENT_ID in environment variables');
}

if (!DISCORD_CHANNEL) {
	throw new Error('Missing DISCORD_CHANNEL in environment variables');
}

export { DISCORD_TOKEN, DISCORD_CLIENT_ID, DISCORD_CHANNEL };
