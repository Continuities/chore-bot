import { describe, it } from 'node:test';
import assert from 'node:assert';
import { assignChores } from './chore-engine';
import ChoresModel from './model/chores';
import { inDays } from './date';

describe('Chore Engine', () => {
	const today = new Date();
	const nextWeek = inDays(today, 7);
	const nextMonth = inDays(today, 30);
	const tests = [
		{
			states: [],
			assignments: [],
			expected: [
				{
					assignedTo: '262840813434830849',
					choreId: 'bathroom',
					dueDate: nextWeek
				},
				{
					assignedTo: '243526819226058752',
					choreId: 'floors',
					dueDate: nextWeek
				},
				{
					assignedTo: '536686650936524836',
					choreId: 'oven',
					dueDate: nextMonth
				},
				{
					assignedTo: '262840813434830849',
					choreId: 'fridge',
					dueDate: nextMonth
				}
			]
		}
	];

	tests.forEach(({ states, assignments, expected }) => {
		const model = ChoresModel({ states, assignments });
		it('should assign new chores', () => {
			const chores = model.getChoreAssignments();
			assert.deepStrictEqual(chores, assignments);
			const assignedChores = assignChores(model);
			const newChores = model.getChoreAssignments();
			assert.deepStrictEqual(
				newChores,
				expected,
				`Expected ${JSON.stringify(chores)} to be ${JSON.stringify(expected)}`
			);
		});
	});
});
