import { Schema, model, Document } from 'mongoose';

export interface IRequest extends Document {
  user: Schema.Types.ObjectId;
  title: string;
  shortDesc: string;
  fullDesc: string;
  budget: number;
  imageUrl?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'rejected';
  createdAt: Date;
}

const requestSchema = new Schema<IRequest>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  shortDesc: { type: String, required: true },
  fullDesc: { type: String, required: true },
  budget: { type: Number, required: true },
  imageUrl: { type: String, required: false },
  status: { 
    type: String, 
    enum: ['pending', 'in-progress', 'completed', 'rejected'], 
    default: 'pending' 
  }
}, {
  timestamps: true
});

export const RequestModel = model<IRequest>('Request', requestSchema);
