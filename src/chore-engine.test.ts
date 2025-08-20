import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getCurrentChores } from './chore-engine';
import ChoresModel from './model/chores';

describe('Chore Engine', () => {
	const tests = [
		{
			states: [{ choreId: 'bathroom', lastCompleted: null, completedBy: null }],
			expected: [
				{ choreId: 'bathroom', assignedTo: '243526819226058752', dueDate: new Date('2025-08-20') }
			]
		}
	];
	tests.forEach(({ states, expected }) => {
		const model = ChoresModel(states);
		it('should return current chores with assignments', () => {
			const chores = getCurrentChores(model);
			assert.deepStrictEqual(
				chores,
				expected,
				`Expected ${JSON.stringify(chores)} to be ${JSON.stringify(expected)}`
			);
		});
	});
});
