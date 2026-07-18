import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'client' | 'admin';
  googleId?: string;
  avatarUrl?: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: false, select: false },
  role: { type: String, enum: ['client', 'admin'], default: 'client' },
  googleId: { type: String, required: false },
  avatarUrl: { type: String, required: false }
}, {
  timestamps: true
});

export const User = model<IUser>('User', userSchema);
