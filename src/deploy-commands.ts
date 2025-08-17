import { REST, Routes } from 'discord.js';
import { DISCORD_TOKEN, DISCORD_CLIENT_ID } from './config';
import Commands from './commands';

const commandsData = Object.values(Commands).map((command) => command.data);

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN as string);

type DeployCommandsProps = {
	guildId: string;
};

export default async function deployCommands({ guildId }: DeployCommandsProps) {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(Routes.applicationGuildCommands(DISCORD_CLIENT_ID as string, guildId), {
			body: commandsData
		});

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
}
