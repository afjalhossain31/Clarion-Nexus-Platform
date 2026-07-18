import { Schema, model, Document } from 'mongoose';

export interface IService extends Document {
  title: string;
  shortDesc: string;
  fullDesc: string;
  category: 'web-development' | 'seo' | 'ui-ux' | 'marketing' | 'ai';
  priceFrom: number;
  deliveryDays: number;
  imageUrl: string;
  rating: number;
  reviewCount: number;
}

const serviceSchema = new Schema<IService>({
  title: { type: String, required: true },
  shortDesc: { type: String, required: true },
  fullDesc: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['web-development', 'seo', 'ui-ux', 'marketing', 'ai'], 
    required: true 
  },
  priceFrom: { type: Number, required: true },
  deliveryDays: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  rating: { type: Number, default: 4.8 },
  reviewCount: { type: Number, default: 12 }
}, {
  timestamps: true
});

export const Service = model<IService>('Service', serviceSchema);
