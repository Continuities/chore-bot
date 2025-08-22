import { WARNING_DAYS } from './config';
import { inDays } from './date';
import { Roommates, getChoreFrequency, getRoommateOrder } from './model/chores';

export const assignChores = (model: ChoresModelType): ChoreAssignment[] => {
	// 1. Get the list of chores that are due in the next X days
	const dueChores = model
		.getDueChores(WARNING_DAYS, new Date())
		// 2. Filter out chores that have already been assigned
		.filter((chore) => model.getChoreAssignment(chore.choreId) === undefined);
	// 3. Assign chores to roommates
	const newAssignments = [];
	for (const { choreId, completedBy, lastCompleted } of dueChores) {
		const order = getRoommateOrder(completedBy);
		const roommates = Roommates.map(({ userId }) => {
			const activeChores = model.getActiveChores(userId);
			// Try to keep workload balanced while considering who last completed the chore
			const rank = activeChores.length * 10 + (order.get(userId) ?? 0);
			return { userId, rank };
		}).sort((a, b) => a.rank - b.rank);
		const assignment: ChoreAssignment = {
			choreId,
			assignedTo: roommates[0].userId,
			dueDate: inDays(lastCompleted ?? new Date(), getChoreFrequency(choreId))
		};
		newAssignments.push(assignment);
		model.assignChore(assignment.choreId, assignment.assignedTo, assignment.dueDate);
	}
	// 4. Return a list of new chore assignments
	return newAssignments;
};
