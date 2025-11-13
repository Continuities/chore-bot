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
		onAdd?: (message: ChoreMessage) => void;
		onDelete?: (messageId: MessageId) => void;
	}
	type ChoreMessagesModelType = ReturnType<typeof ChoreMessagesModel>;
}

const ChoreMessagesModel = (init?: ChoreMessagesModelInit) => {
	const initMessages = init?.messages || [];
	const choreMessages: Map<string, ChoreMessage> = new Map(
		initMessages.map((msg) => [msg.messageId, msg])
	);
	return {
		all: () => {
			return Array.from(choreMessages.values());
		},
		get: (messageId: MessageId) => {
			return choreMessages.get(messageId);
		},
		add: (message: ChoreMessage) => {
			choreMessages.set(message.messageId, message);
			if (init?.onAdd) {
				init.onAdd(message);
			}
		},
		delete: (messageId: MessageId) => {
			choreMessages.delete(messageId);
			if (init?.onDelete) {
				init.onDelete(messageId);
			}
		}
	};
};

export default ChoreMessagesModel;
