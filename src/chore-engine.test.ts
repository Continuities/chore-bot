import { describe, it } from 'node:test';
import assert from 'node:assert';
import { assignChores } from './chore-engine';
import ChoresModel from './model/chores';

describe('Chore Engine', () => {
	const tests = [
		{
			states: undefined,
			assignments: [],
			expected: [
				// { choreId: 'bathroom', assignedTo: '243526819226058752', dueDate: new Date('2025-08-20') }
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
