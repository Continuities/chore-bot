import { describe, it } from 'node:test';
import assert from 'node:assert';
import ChoresModel, { getChoreDescription, getRoommate } from './chores';

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
	const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
	const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

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
});
