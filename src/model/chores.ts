declare global {
	type ChoreId = string;
	type UserId = string; // Discord user ID

	type ChoreDefinition = {
		id: ChoreId;
		description: string;
		longDescription: string;
		frequencyDays: number;
	};

	type Roommate = {
		name: string;
		userId: UserId;
	};

	type ChoreAssignment = {
		choreId: ChoreId;
		assignedTo: string;
		dueDate: Date;
	};

	type ChoreState = {
		choreId: ChoreId;
		lastCompleted: Date | null;
		completedBy: string | null;
	};

	type ChoresModelType = ReturnType<typeof ChoresModel>;

	type ChoreModelInit = {
		states?: ChoreState[];
		assignments?: ChoreAssignment[];
	};
}

const Chores: ChoreDefinition[] = [
	{
		id: 'bathroom',
		description: 'clean the bathroom',
		longDescription:
			'Clean the toilet, bathtub, and sink. Wipe the mirrors and cabinets. Remove hair from the cat door. Mop the floor.',
		frequencyDays: 7
	},
	{
		id: 'floors',
		description: 'clean the common-area floors',
		longDescription: 'Vacuum and mop the living room, kitchen, and hallway floors.',
		frequencyDays: 7
	},
	{
		id: 'terrace',
		description: 'care for the terrace',
		longDescription:
			'Summer: Water the plants, sweep the floor, and wipe down furniture. Winter: Shovel enough snow to walk and sit.',
		frequencyDays: 7
	},
	{
		id: 'oven',
		description: 'clean the oven',
		longDescription: 'Deep clean the oven interior, racks, and door.',
		frequencyDays: 30
	},
	{
		id: 'fridge',
		description: 'clean the fridge',
		longDescription: 'Clean the fridge interior and shelves. Remove old food.',
		frequencyDays: 30
	}
];

export const Roommates: Roommate[] = [
	{ name: 'Matt', userId: '262840813434830849' },
	{ name: 'Michael', userId: '243526819226058752' },
	{ name: 'Jack', userId: '536686650936524836' }
] as const;

const choreMap: Record<ChoreId, ChoreDefinition> = Object.fromEntries(
	Chores.map((chore) => [chore.id, chore])
);

const roommateMap: Record<UserId, Roommate> = Object.fromEntries(
	Roommates.map((roommate) => [roommate.userId, roommate])
);

const ChoresModel = (init?: ChoreModelInit) => {
	const ChoreStates = Object.fromEntries((init?.states ?? []).map((s) => [s.choreId, s]));
	for (const chore of Chores) {
		if (!ChoreStates[chore.id]) {
			ChoreStates[chore.id] = {
				choreId: chore.id,
				lastCompleted: null,
				completedBy: null
			};
		}
	}
	const ChoreAssignments = init?.assignments
		? new Map(init?.assignments.map((a) => [a.choreId, a]))
		: new Map<ChoreId, ChoreAssignment>();
	return {
		getDueChores: (withinDays: number, ofDate: Date): ChoreState[] =>
			Chores.map((chore) => {
				const state = ChoreStates[chore.id];
				const dueDate = state.lastCompleted
					? new Date(state.lastCompleted.getTime() + chore.frequencyDays * 24 * 60 * 60 * 1000)
					: ofDate;
				if (ofDate < new Date(dueDate.getTime() - withinDays * 24 * 60 * 60 * 1000)) {
					return null;
				}
				return state;
			}).filter(Boolean) as ChoreState[],
		getChoreAssignments: (): ChoreAssignment[] => [...ChoreAssignments.values()],
		getChoreAssignment: (choreId: ChoreId): ChoreAssignment | undefined =>
			ChoreAssignments.get(choreId),
		assignChore: (choreId: ChoreId, assignedTo: UserId, dueDate: Date): void => {
			ChoreAssignments.set(choreId, { choreId, assignedTo, dueDate });
		},
		markChoreCompleted: (choreId: ChoreId, completedBy: UserId, completedAt: Date): void => {
			const state = ChoreStates[choreId];
			if (state) {
				state.lastCompleted = completedAt;
				state.completedBy = completedBy;
			}
			ChoreAssignments.delete(choreId);
		},
		getActiveChores: (roommate: UserId): ChoreAssignment[] => {
			const today = new Date();
			return [...ChoreAssignments.values()].filter(
				(assignment) => assignment.assignedTo === roommate && assignment.dueDate >= today
			);
		}
	};
};

export default ChoresModel;

export const getChoreDescription = (choreId: ChoreId): string => choreMap[choreId].description;
export const getChoreFrequency = (choreId: ChoreId): number => choreMap[choreId].frequencyDays;
export const getRoommate = (userId: UserId): Roommate => roommateMap[userId];
export const getRoommateOrder = (startAfter?: UserId | null): Map<UserId, number> => {
	const afterIndex = startAfter
		? Roommates.findIndex((r) => r.userId === startAfter)
		: Roommates.length - 1;
	return new Map(
		Roommates.map((r, index) => [
			r.userId,
			(index + Roommates.length - afterIndex - 1) % Roommates.length
		])
	);
};
