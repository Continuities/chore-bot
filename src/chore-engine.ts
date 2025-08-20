export const getCurrentChores = (model: ChoresModelType): ChoreAssignment[] => {
	// TODO

	// 1. Get the list of chores that are due in the next X days
	// 2. Filter out chores that have already been assigned
	// 3. Assign chores to roommates in a round-robin fashion
	// 4. Return the list of chores with assignments

	return [
		{
			choreId: 'bathroom',
			assignedTo: '243526819226058752',
			dueDate: new Date('2025-08-20')
		}
	];
};
