import { describe, it } from 'node:test';
import assert from 'node:assert';
import { assignChores } from './chore-engine';
import ChoresModel, { Roommates } from './model/chores';
import { inDays, withoutTime } from './date';

describe('Chore Engine', () => {
	const today = withoutTime(new Date());
	const tomorrow = inDays(today, 1);
	const nextWeek = inDays(today, 7);
	const nextMonth = inDays(today, 30);
	const matt = Roommates[0].userId;
	const michael = Roommates[1].userId;
	const jack = Roommates[2].userId;
	const tests = [
		{
			states: [],
			assignments: [],
			expected: [
				{
					assignedTo: matt,
					choreId: 'bathroom',
					dueDate: nextWeek
				},
				{
					assignedTo: michael,
					choreId: 'floors',
					dueDate: nextWeek
				},
				{
					assignedTo: jack,
					choreId: 'oven',
					dueDate: nextMonth
				},
				{
					assignedTo: matt,
					choreId: 'fridge',
					dueDate: nextMonth
				}
			]
		},
		{
			states: [
				{
					choreId: 'bathroom',
					completedBy: matt,
					lastCompleted: inDays(today, -6)
				}
			],
			assignments: [],
			expected: [
				{
					assignedTo: michael,
					choreId: 'bathroom',
					dueDate: tomorrow
				},
				{
					assignedTo: matt,
					choreId: 'floors',
					dueDate: nextWeek
				},
				{
					assignedTo: jack,
					choreId: 'oven',
					dueDate: nextMonth
				},
				{
					assignedTo: matt,
					choreId: 'fridge',
					dueDate: nextMonth
				}
			]
		},
		{
			states: [
				{
					choreId: 'bathroom',
					completedBy: matt,
					lastCompleted: inDays(today, -6)
				},
				{
					choreId: 'floors',
					completedBy: jack,
					lastCompleted: today
				},
				{
					choreId: 'oven',
					completedBy: michael,
					lastCompleted: inDays(today, -29)
				},
				{
					choreId: 'fridge',
					completedBy: matt,
					lastCompleted: today
				}
			],
			assignments: [],
			expected: [
				{
					assignedTo: michael,
					choreId: 'bathroom',
					dueDate: tomorrow
				},
				{
					assignedTo: jack,
					choreId: 'oven',
					dueDate: tomorrow
				}
			]
		},
		{
			states: [
				{
					choreId: 'bathroom',
					completedBy: michael,
					lastCompleted: inDays(today, -6)
				},
				{
					choreId: 'floors',
					completedBy: matt,
					lastCompleted: inDays(today, -6)
				},
				{
					choreId: 'oven',
					completedBy: jack,
					lastCompleted: inDays(today, -29)
				},
				{
					choreId: 'fridge',
					completedBy: michael,
					lastCompleted: inDays(today, -29)
				}
			],
			assignments: [],
			expected: [
				{
					assignedTo: jack,
					choreId: 'bathroom',
					dueDate: tomorrow
				},
				{
					assignedTo: michael,
					choreId: 'floors',
					dueDate: tomorrow
				},
				{
					assignedTo: matt,
					choreId: 'oven',
					dueDate: tomorrow
				},
				{
					assignedTo: jack,
					choreId: 'fridge',
					dueDate: tomorrow
				}
			]
		}
	];

	tests.forEach(({ states, assignments, expected }, index) => {
		const model = ChoresModel({ states, assignments });
		it('should assign new chores', () => {
			const chores = model.getChoreAssignments();
			assert.deepStrictEqual(chores, assignments);
			assignChores(model);
			const newChores = model.getChoreAssignments();
			assert.deepStrictEqual(
				newChores,
				expected,
				`[${index}] Expected ${JSON.stringify(chores)} to be ${JSON.stringify(expected)}`
			);
		});
	});
});
