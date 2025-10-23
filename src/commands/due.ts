import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { assignmentToString, getRoommate } from '../model/chores';

export const data = new SlashCommandBuilder()
	.setName('due')
	.setDescription(`Displays your upcoming chore due dates`);

export async function execute(model: ChoresModelType, interaction: CommandInteraction) {
	const chores = model
		.getChoreAssignments()
		.filter((chore) => chore.assignedTo === interaction.user.id);
	if (chores.length === 0) {
		return interaction.reply({ content: 'All chores completed 🎉', flags: ['Ephemeral'] });
	}
	const choreList = chores.map((chore) => assignmentToString(chore)).join('\n\n');
	return interaction.reply({ content: choreList, flags: ['Ephemeral'] });
}
