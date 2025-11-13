import { describe, it } from 'node:test';
import assert from 'node:assert';
import ChoreMessagesModel from './chore-messages';
describe('Chore Messages Model', () => {
	describe('Chore Messages Model', () => {
		it('should initialize with no messages if none are provided', () => {
			const model = ChoreMessagesModel();
			assert.strictEqual(model.get('nonexistent'), undefined);
		});

		it('should initialize with provided messages', () => {
			const initialMessages = [
				{
					choreId: 'chore1',
					guildId: 'guild1',
					channelId: 'channel1',
					messageId: 'message1'
				}
			];
			const model = ChoreMessagesModel({ messages: initialMessages });
			assert.deepStrictEqual(model.get('message1'), initialMessages[0]);
		});

		it('should add a new message', () => {
			const model = ChoreMessagesModel();
			const newMessage = {
				choreId: 'chore2',
				guildId: 'guild2',
				channelId: 'channel2',
				messageId: 'message2'
			};
			model.add(newMessage);
			assert.deepStrictEqual(model.get('message2'), newMessage);
		});

		it('should delete a message by messageId', () => {
			const initialMessages = [
				{
					choreId: 'chore3',
					guildId: 'guild3',
					channelId: 'channel3',
					messageId: 'message3'
				}
			];
			const model = ChoreMessagesModel({ messages: initialMessages });
			model.delete('message3');
			assert.strictEqual(model.get('message3'), undefined);
		});

		it('should not throw an error when deleting a nonexistent message', () => {
			const model = ChoreMessagesModel();
			assert.doesNotThrow(() => model.delete('nonexistent'));
		});
	});
});
