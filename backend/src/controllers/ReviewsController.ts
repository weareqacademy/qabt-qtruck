import { Request, Response } from 'express';

import * as Yup from 'yup';

import Review from '../models/Reviews'
import FoodTruck from '../models/FoodTruck';

export default {

  async create(req: Request, res: Response) {

    const { id } = req.params;
    const { user_id } = req;

    console.log(user_id)
    const {
      stars,
      comment,
    } = req.body;

    const data = {
      stars,
      comment,
      foodtruck_id: id,
      rated_by: user_id
    }

    const schema = Yup.object().shape({
      stars: Yup.number().required(),
      comment: Yup.string().required().max(300)
    });

    await schema.validate(data, {
      abortEarly: false
    });

    const ft = await FoodTruck.findById(id)

    if (!ft)
      return res.status(404).json({ error: 'foottruck not fount', bcode: 1000 })

    const dup = await Review.findOne({ rated_by: data.rated_by, foodtruck_id: id })

    if (dup)
      return res.status(400).json({ error: 'only one review per user', bcode: 1003 })

    const review = new Review(data);
    const result = await review.save();

    res.status(201).json(result);
  }
}