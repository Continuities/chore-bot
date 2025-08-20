import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getCurrentChores } from './chore-engine';

describe('Chore Engine', () => {
	it('should return current chores with assignments', () => {
		const chores = getCurrentChores();
		assert(Array.isArray(chores), 'Expected chores to be an array');
		assert(chores.length > 0, 'Expected at least one chore to be returned');

		chores.forEach((chore) => {
			assert(chore.choreId, 'Chore should have a choreId');
			assert(chore.assignedTo, 'Chore should have an assignedTo userId');
			assert(chore.dueDate instanceof Date, 'Due date should be a Date object');
		});
	});
});
