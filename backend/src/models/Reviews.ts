import { Schema, model } from 'mongoose';

interface IReview {
    stars: number;
    comment: string;
    foodtruck_id: Schema.Types.ObjectId;
    rated_by: Schema.Types.ObjectId;
    created_at: Date;
}

const schema = new Schema<IReview>({
    stars: { type: Number, required: true },
    comment: { type: String, required: true },
    foodtruck_id: {
        type: Schema.Types.ObjectId,
        ref: 'FoodTruck'
    },
    rated_by: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false });

export default model<IReview>('Reviews', schema);