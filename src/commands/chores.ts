import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { getRoommate } from '../model/chores';

export const data = new SlashCommandBuilder()
	.setName('chores')
	.setDescription(`Displays the current chore assignments`);

export async function execute(model: ChoresModelType, interaction: CommandInteraction) {
	const chores = model.getChoreAssignments();
	if (chores.length === 0) {
		return interaction.reply('No chores assigned.');
	}
	const choreList = chores
		.map(
			(chore) =>
				`${chore.choreId}: ${getRoommate(chore.assignedTo)}, due ${chore.dueDate.toDateString()}`
		)
		.join('\n');
	return interaction.reply('TODO: Implement chores command!');
}
