import { Schema, model, Document } from 'mongoose';

export interface IMessage {
  role: 'user' | 'assistant';
  content: string;
  createdAt?: Date;
}

export interface IChatHistory extends Document {
  user: Schema.Types.ObjectId;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const chatHistorySchema = new Schema<IChatHistory>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  messages: [messageSchema]
}, {
  timestamps: true
});

export const ChatHistory = model<IChatHistory>('ChatHistory', chatHistorySchema);
