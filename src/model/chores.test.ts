import { describe, it } from 'node:test';
import assert from 'node:assert';
import ChoresModel, {
	getChoreDescription,
	getRoommate,
	getRoommateOrder,
	Roommates
} from './chores';
import { inDays } from '../date';

describe('Chore Model', () => {
	it('should return chore description for a valid choreId', () => {
		const description = getChoreDescription('bathroom');
		assert.strictEqual(description, 'clean the bathroom', 'Expected description to match');
	});

	it('should return roommate details for a valid userId', () => {
		const roommate = getRoommate('262840813434830849');
		assert.strictEqual(roommate.name, 'Matt', 'Expected roommate name to match');
	});

	const today = new Date();
	const tomorrow = inDays(today, 1);
	const lastWeek = inDays(today, -7);
	const lastMonth = inDays(today, -30);
	const matt = Roommates[0].userId;
	const michael = Roommates[1].userId;
	const jack = Roommates[2].userId;

	const getDueChoresTests = [
		{
			withinDays: 0,
			states: [],
			expected: [
				{ choreId: 'bathroom', lastCompleted: null, completedBy: null },
				{ choreId: 'floors', lastCompleted: null, completedBy: null },
				{ choreId: 'oven', lastCompleted: null, completedBy: null },
				{ choreId: 'fridge', lastCompleted: null, completedBy: null }
			]
		},
		{
			withinDays: 0,
			states: [
				{ choreId: 'bathroom', lastCompleted: today, completedBy: 'alice' },
				{ choreId: 'floors', lastCompleted: today, completedBy: 'bob' },
				{ choreId: 'oven', lastCompleted: null, completedBy: null },
				{ choreId: 'fridge', lastCompleted: null, completedBy: null }
			],
			expected: [
				{ choreId: 'oven', lastCompleted: null, completedBy: null },
				{ choreId: 'fridge', lastCompleted: null, completedBy: null }
			]
		},
		{
			withinDays: 2,
			states: [
				{ choreId: 'bathroom', lastCompleted: lastWeek, completedBy: 'alice' },
				{ choreId: 'floors', lastCompleted: lastWeek, completedBy: 'bob' },
				{ choreId: 'oven', lastCompleted: lastWeek, completedBy: 'chris' },
				{ choreId: 'fridge', lastCompleted: lastWeek, completedBy: 'diana' }
			],
			expected: [
				{ choreId: 'bathroom', lastCompleted: lastWeek, completedBy: 'alice' },
				{ choreId: 'floors', lastCompleted: lastWeek, completedBy: 'bob' }
			]
		},
		{
			withinDays: 2,
			states: [
				{ choreId: 'bathroom', lastCompleted: today, completedBy: 'alice' },
				{ choreId: 'floors', lastCompleted: today, completedBy: 'bob' },
				{ choreId: 'oven', lastCompleted: lastMonth, completedBy: 'chris' },
				{ choreId: 'fridge', lastCompleted: lastMonth, completedBy: 'diana' }
			],
			expected: [
				{ choreId: 'oven', lastCompleted: lastMonth, completedBy: 'chris' },
				{ choreId: 'fridge', lastCompleted: lastMonth, completedBy: 'diana' }
			]
		},
		{
			withinDays: 1,
			states: [
				{ choreId: 'bathroom', lastCompleted: inDays(today, -5), completedBy: 'alice' },
				{ choreId: 'floors', lastCompleted: today, completedBy: 'bob' },
				{ choreId: 'oven', lastCompleted: today, completedBy: 'chris' },
				{ choreId: 'fridge', lastCompleted: today, completedBy: 'diana' }
			],
			expected: []
		},
		{
			withinDays: 2,
			states: [
				{ choreId: 'bathroom', lastCompleted: inDays(today, -5), completedBy: 'alice' },
				{ choreId: 'floors', lastCompleted: today, completedBy: 'bob' },
				{ choreId: 'oven', lastCompleted: today, completedBy: 'chris' },
				{ choreId: 'fridge', lastCompleted: today, completedBy: 'diana' }
			],
			expected: [{ choreId: 'bathroom', lastCompleted: inDays(today, -5), completedBy: 'alice' }]
		}
	];
	getDueChoresTests.forEach(({ states, withinDays, expected }) => {
		it('should return due chores within specified days', () => {
			const model = ChoresModel({ states });
			const dueChores = model.getDueChores(withinDays, today);
			assert.deepStrictEqual(
				dueChores,
				expected,
				`Expected ${JSON.stringify(dueChores)} to be ${JSON.stringify(expected)}`
			);
		});
	});

	const getChoreAssignmentsTests = [
		{ assignments: [], expected: [] },
		{
			assignments: [{ choreId: 'bathroom', assignedTo: 'alice', dueDate: today }],
			expected: [{ choreId: 'bathroom', assignedTo: 'alice', dueDate: today }]
		}
	];
	getChoreAssignmentsTests.forEach(({ assignments, expected }) => {
		it('should return current chore assignments', () => {
			const model = ChoresModel({ assignments });
			const currentAssignments = model.getChoreAssignments();
			assert.deepStrictEqual(
				currentAssignments,
				expected,
				`Expected ${JSON.stringify(currentAssignments)} to be ${JSON.stringify(expected)}`
			);
		});
	});

	it('should assign chores correctly', () => {
		const model = ChoresModel();
		const oldChores = model.getChoreAssignments();
		assert.deepStrictEqual(oldChores, [], 'Expected no initial assignments');
		model.assignChore('bathroom', 'alice', today);
		const newChores = model.getChoreAssignments();
		assert.deepStrictEqual(
			newChores,
			[{ choreId: 'bathroom', assignedTo: 'alice', dueDate: today }],
			`Expected chore assignment to be added`
		);
	});

	it('should remove chore assignments on completion', () => {
		const model = ChoresModel({
			assignments: [{ choreId: 'bathroom', assignedTo: 'alice', dueDate: today }]
		});
		const oldAssignments = model.getChoreAssignments();
		assert.deepStrictEqual(oldAssignments, [
			{ choreId: 'bathroom', assignedTo: 'alice', dueDate: today }
		]);
		model.markChoreCompleted('bathroom', 'alice', today);
		const newAssignments = model.getChoreAssignments();
		assert.deepStrictEqual(
			newAssignments,
			[],
			'Expected assignments to be cleared after completion'
		);
	});

	it('should get active chores for a roommate', () => {
		const model = ChoresModel({
			assignments: [
				{ choreId: 'bathroom', assignedTo: 'alice', dueDate: lastWeek },
				{ choreId: 'oven', assignedTo: 'alice', dueDate: tomorrow },
				{ choreId: 'floors', assignedTo: 'bob', dueDate: tomorrow }
			]
		});
		assert.deepStrictEqual(model.getActiveChores('alice'), [
			{ choreId: 'oven', assignedTo: 'alice', dueDate: tomorrow }
		]);
		assert.deepStrictEqual(model.getActiveChores('bob'), [
			{ choreId: 'floors', assignedTo: 'bob', dueDate: tomorrow }
		]);
		assert.deepStrictEqual(model.getActiveChores('charlie'), []);
	});

	const getRoommateOrderTests = [
		{
			startAfter: undefined,
			expected: [
				[matt, 0],
				[michael, 1],
				[jack, 2]
			]
		},
		{
			startAfter: matt,
			expected: [
				[michael, 0],
				[jack, 1],
				[matt, 2]
			]
		},
		{
			startAfter: michael,
			expected: [
				[jack, 0],
				[matt, 1],
				[michael, 2]
			]
		},
		{
			startAfter: jack,
			expected: [
				[matt, 0],
				[michael, 1],
				[jack, 2]
			]
		}
	];
	getRoommateOrderTests.forEach(({ startAfter, expected }, i) => {
		it('should return roommates in correct order', () => {
			const order = getRoommateOrder(startAfter);
			const orderArray = Array.from(order.entries());
			assert.deepStrictEqual(
				orderArray.sort(),
				expected.sort(),
				`[${i}] Expected order to be ${JSON.stringify(expected)}`
			);
		});
	});
});
