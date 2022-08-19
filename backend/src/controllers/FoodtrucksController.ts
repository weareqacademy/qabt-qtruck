import { Request, Response } from 'express';

import * as Yup from 'yup';

import FoodTruck from '../models/FoodTruck'
import Reviews from '../models/Reviews';

export default {
  async list(req: Request, res: Response) {
    const foodtrucks = await FoodTruck.find();
    return res.json(foodtrucks);
  },

  async unique(req: Request, res: Response) {
    const { id } = req.params;

    const foodtruck = await FoodTruck.findById(id)
      .populate([
        { path: 'suggested_by', select: 'instagram', }
      ]);

    if (!foodtruck)
      return res.status(404).end()

    const reviews = await Reviews.find({ foodtruck_id: id }, { foodtruck_id: 0 })
      .sort({created_at: -1})
      .populate([
        { path: 'rated_by', select: 'name instagram', }
      ]);

    return res.json({ item: foodtruck, reviews: reviews });
  },

  async remove(req: Request, res: Response) {
    const { id } = req.params;
    const foodtruck = await FoodTruck.findByIdAndRemove(id)

    if (!foodtruck)
      return res.status(404).end()

    return res.json(foodtruck);
  },

  async create(req: Request, res: Response) {
    const {
      name,
      latitude,
      longitude,
      details,
      opening_hours,
      open_on_weekends
    } = req.body;

    const { user_id } = req;

    const data = {
      name,
      latitude,
      longitude,
      details,
      opening_hours,
      open_on_weekends,
      suggested_by: user_id
    }

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      latitude: Yup.number().required(),
      longitude: Yup.number().required(),
      details: Yup.string().required().max(300),
      opening_hours: Yup.string().required(),
      open_on_weekends: Yup.boolean().required()
    });

    await schema.validate(data, {
      abortEarly: false
    });


    const dup = await FoodTruck.findOne({ name: data.name })

    if (dup)
      return res.status(400).json({ error: 'duplicate foodtruck', bcode: 1001 })

    const foodtruck = new FoodTruck(data);
    const result = await foodtruck.save();

    res.status(201).json(result);
  }
}