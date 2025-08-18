import { ChannelType, Client } from 'discord.js';
import Commands from './commands';
import { DISCORD_CHANNEL, DISCORD_TOKEN } from './config';
import deployCommands from './deploy-commands';
import cron from 'node-cron';

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

cron.schedule('*/5 * * * * *', async () => {
	console.log('Running scheduled tasks...');
	client.guilds.cache.forEach((guild) => {
		guild.channels.cache
			.filter((channel) => channel.type === ChannelType.GuildText)
			.filter((channel) => channel.name === DISCORD_CHANNEL)
			.forEach((channel) => {
				console.log(`Messaging ${guild.name}::${channel.name}`);
				channel.send('This is a scheduled message from Chorebot!').catch(console.error);
			});
	});
});

client.login(DISCORD_TOKEN);
