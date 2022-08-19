import { Schema, model } from 'mongoose';

interface IFoodTruck {
    name: string;
    details: string;
    latitude: number;
    longitude: number;
    opening_hours: string;
    open_on_weekends: boolean;
    suggested_by: Schema.Types.ObjectId;
}

const foodTruckSchema = new Schema<IFoodTruck>({
    name: { type: String, required: true },
    details: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    opening_hours: { type: String, required: true },
    open_on_weekends: { type: Boolean, required: true },
    suggested_by: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { versionKey: false });

export default model<IFoodTruck>('FoodTruck', foodTruckSchema);