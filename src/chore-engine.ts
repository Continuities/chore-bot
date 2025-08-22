import { WARNING_DAYS } from './config';

export const assignChores = (model: ChoresModelType): ChoreAssignment[] => {
	// 1. Get the list of chores that are due in the next X days
	const dueChores = model.getDueChores(WARNING_DAYS, new Date());
	// 2. Filter out chores that have already been assigned
	dueChores.filter((chore) => model.getChoreAssignment(chore.choreId) === undefined);
	// 3. Assign chores to roommates in a round-robin fashion
	// TODO
	// 4. Return the list of chores with assignments
	// TODO

	return [
		{
			choreId: 'bathroom',
			assignedTo: '243526819226058752',
			dueDate: new Date('2025-08-20')
		}
	];
};
