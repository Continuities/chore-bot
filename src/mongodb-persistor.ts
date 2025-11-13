declare global {
	interface MongoDBPersistorInit {
		uri: string;
		username: string;
		password: string;
	}
}

import { MongoClient } from 'mongodb';

const CHORE_STATES = 'choreStates';
const CHORE_ASSIGNMENTS = 'choreAssignments';
const CHORE_MESSAGES = 'choreMessages';

const MongoDBPersistor = async ({ uri, username, password }: MongoDBPersistorInit) => {
	const client = new MongoClient(uri, {
		auth: {
			username,
			password
		}
	});

	await client.connect();
	const db = client.db();
	console.log('Connected to MongoDB');

	return {
		addChoreMessage: async (choreMessage: ChoreMessage) => {
			const messages = db.collection(CHORE_MESSAGES);
			await messages.insertOne(choreMessage);
			console.log('Chore message added to MongoDB: ', choreMessage);
		},
		removeChoreMessage: async (messageId: string) => {
			const messages = db.collection(CHORE_MESSAGES);
			await messages.deleteOne({ id: messageId });
			console.log('Chore message removed from MongoDB: ', messageId);
		},
		assignChore: async (assignment: ChoreAssignment) => {
			const assignments = db.collection(CHORE_ASSIGNMENTS);
			await assignments.insertOne(assignment);
			console.log('Chore assigned in MongoDB: ', assignment);
		},
		completeChore: async (state: ChoreState) => {
			const states = db.collection(CHORE_STATES);
			const assignments = db.collection(CHORE_ASSIGNMENTS);
			await assignments.deleteOne({ choreId: state.choreId });
			console.log('Chore assignment removed from MongoDB: ', state.choreId);
			await states.updateOne(
				{ choreId: state.choreId },
				{ $set: { lastCompleted: state.lastCompleted, completedBy: state.completedBy } },
				{ upsert: true }
			);
			console.log('Chore state updated in MongoDB: ', state);
		},
		getChores: async (): Promise<ChoreState[]> => {
			const states = db.collection(CHORE_STATES);
			const allStates = await states.find().toArray();
			return allStates.map((s) => ({
				choreId: s.choreId,
				lastCompleted: s.lastCompleted,
				completedBy: s.completedBy
			}));
		},
		getChoreAssignments: async (): Promise<ChoreAssignment[]> => {
			const assignments = db.collection(CHORE_ASSIGNMENTS);
			const allAssignments = await assignments.find().toArray();
			return allAssignments.map((a) => ({
				choreId: a.choreId,
				assignedTo: a.assignedTo,
				dueDate: a.dueDate
			}));
		},
		getChoreMessages: async (): Promise<ChoreMessage[]> => {
			const messages = db.collection(CHORE_MESSAGES);
			const allMessages = await messages.find().toArray();
			return allMessages.map((m) => ({
				choreId: m.choreId,
				guildId: m.guildId,
				channelId: m.channelId,
				messageId: m.messageId
			}));
		}
	};
};

export default MongoDBPersistor;
