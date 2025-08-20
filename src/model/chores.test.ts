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

	const tests = [
		{
			withinDays: 0,
			states: undefined,
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
		}
	];
	tests.forEach(({ states, withinDays, expected }) => {
		it('should return due chores within specified days', () => {
			const model = ChoresModel(states);
			const dueChores = model.getDueChores(withinDays, today);
			assert.deepStrictEqual(
				dueChores,
				expected,
				`Expected ${JSON.stringify(dueChores)} to be ${JSON.stringify(expected)}`
			);
		});
	});
});
