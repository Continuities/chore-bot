type ChoreId = string;

type ChoreDefinition = {
	id: ChoreId;
	description: string;
	frequencyDays: number;
};

type Roommate = {
	name: string;
	userId: string;
};

export type ChoreAssignment = {
	choreId: ChoreId;
	assignedTo: string;
	dueDate: Date;
};

const Chores: ChoreDefinition[] = [
	{
		id: 'bathroom',
		description: 'clean the bathroom',
		frequencyDays: 7
	},
	{
		id: 'floors',
		description: 'clean the common-area floors',
		frequencyDays: 7
	},
	{
		id: 'oven',
		description: 'clean the oven',
		frequencyDays: 30
	},
	{
		id: 'fridge',
		description: 'clean the fridge',
		frequencyDays: 30
	}
];

const choreMap: Record<ChoreId, ChoreDefinition> = Object.fromEntries(
	Chores.map((chore) => [chore.id, chore])
);

const Roommates: Roommate[] = [
	{ name: 'Matt', userId: '262840813434830849' },
	{ name: 'Michael', userId: '243526819226058752' },
	{ name: 'Jack', userId: '536686650936524836' }
];

export const getChore = (choreId: ChoreId): ChoreDefinition => choreMap[choreId];

export const getCurrentChores = (): ChoreAssignment[] => {
	// TODO
	return [
		{
			choreId: 'bathroom',
			assignedTo: '243526819226058752',
			dueDate: new Date('2025-08-20')
		}
	];
};
