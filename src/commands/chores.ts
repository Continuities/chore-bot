import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('chores')
	.setDescription(`Reminds everyone of the day's chores.`);

export async function execute(interaction: CommandInteraction) {
	return interaction.reply('TODO: Implement chores command!');
}
