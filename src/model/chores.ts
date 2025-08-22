declare global {
	type ChoreId = string;
	type UserId = string; // Discord user ID

	type ChoreDefinition = {
		id: ChoreId;
		description: string;
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

const Roommates: Roommate[] = [
	{ name: 'Matt', userId: '262840813434830849' },
	{ name: 'Michael', userId: '243526819226058752' },
	{ name: 'Jack', userId: '536686650936524836' }
];

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
		}
	};
};

export default ChoresModel;

export const getChoreDescription = (choreId: ChoreId): string => choreMap[choreId].description;
export const getRoommate = (userId: UserId): Roommate => roommateMap[userId];
