declare global {
	type GuildId = string;
	type ChannelId = string;
	type MessageId = string;
	interface ChoreMessage {
		choreId: ChoreId;
		guildId: GuildId;
		channelId: ChannelId;
		messageId: MessageId;
	}
	interface ChoreMessagesModelInit {
		messages?: ChoreMessage[];
	}
	type ChoreMessagesModelType = ReturnType<typeof ChoreMessagesModel>;
}

const ChoreMessagesModel = (init?: ChoreMessagesModelInit) => {
	const initMessages = init?.messages || [];
	const choreMessages: Map<string, ChoreMessage> = new Map(
		initMessages.map((msg) => [msg.messageId, msg])
	);
	return {
		get: (messageId: MessageId) => {
			return choreMessages.get(messageId);
		},
		add: (message: ChoreMessage) => {
			choreMessages.set(message.messageId, message);
		},
		delete: (messageId: MessageId) => {
			choreMessages.delete(messageId);
		}
	};
};

export default ChoreMessagesModel;
