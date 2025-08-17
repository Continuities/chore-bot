import { Client } from 'discord.js';
import Commands from './commands';
import { DISCORD_TOKEN } from './config';
import deployCommands from './deploy-commands';

const client = new Client({
	intents: ['Guilds', 'GuildMessages', 'DirectMessages']
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

client.login(DISCORD_TOKEN);
