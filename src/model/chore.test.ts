import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getChoreDescription, getRoommate, getDueChores } from './chore';

describe('Chore Model', () => {
	it('should return chore description for a valid choreId', () => {
		const description = getChoreDescription('bathroom');
		assert.strictEqual(description, 'clean the bathroom', 'Expected description to match');
	});

	it('should return roommate details for a valid userId', () => {
		const roommate = getRoommate('262840813434830849');
		assert.strictEqual(roommate.name, 'Matt', 'Expected roommate name to match');
	});

	it('should return due chores within specified days', () => {
		const today = new Date();
		const dueChores = getDueChores(7, today);
		assert(Array.isArray(dueChores), 'Expected due chores to be an array');
		dueChores.forEach((chore) => {
			assert(chore.choreId, 'Each chore should have a choreId');
			assert(
				chore.lastCompleted === null || chore.lastCompleted instanceof Date,
				'lastCompleted should be null or a Date'
			);
		});
	});
});
