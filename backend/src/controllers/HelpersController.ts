import { Request, Response } from 'express'

import User from '../models/User'
import FoodTruck from '../models/FoodTruck'

export default {

    async resetUser(req: Request, res: Response) {

        const { instagram } = req.query

        const user = await User.findOne({instagram: instagram})

        if (!user)
            return res.status(204).end()

        await FoodTruck.deleteMany({suggested_by: user._id})
        await User.deleteMany({instagram: instagram})

        return res.status(204).end()
    }

}