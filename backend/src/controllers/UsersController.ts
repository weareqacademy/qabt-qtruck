import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import * as Yup from 'yup';

import User from '../models/User'

export default {

  async signup(req: Request, res: Response) {
    const {
      name,
      instagram,
      password,
    } = req.body;

    const data = {
      name,
      instagram,
      password,
    }

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      instagram: Yup.string().required(),
      password: Yup.string().required()
    });

    await schema.validate(data, {
      abortEarly: false
    });

    const dup = await User.findOne({ instagram: data.instagram })

    if (dup)
      return res.status(400).json({ error: 'duplicate user', bcode: 1001 })

    const user = new User(data);
    const result = await user.save();

    res.status(201).json(result);
  },

  async sessions(req: Request, res: Response) {
    const {
      instagram,
      password,
    } = req.body;

    const data = {
      instagram,
      password,
    }

    const schema = Yup.object().shape({
      instagram: Yup.string().required(),
      password: Yup.string().required()
    });

    await schema.validate(data, {
      abortEarly: false
    });

    const user = await User.findOne({ instagram: data.instagram })

    if (!user)
      return res.status(401).end()

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ _id: user._id, name: user.name, instagram: user.instagram }, 'QAcademy', {
        expiresIn: 60000
      })

      return res.status(200).json({
        user: { _id: user._id, name: user.name, instagram: user.instagram },
        token: token
      })
    } else {
      return res.status(401).end()
    }
  },

  async auth(req: Request, res: Response, next: any) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' })

    jwt.verify(token, 'QAcademy', (err: any, decoded: any) => {
      if (err) return res.status(401).json({ auth: false, message: 'Failed to authenticate token.' })
      req.user_id = decoded._id;
      next();
    });
  },

  async refresh(req: Request, res: Response, next: any) {
    const token = req.headers['authorization'];

    if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' })

    jwt.verify(token, 'QAcademy', (err: any, decoded: any) => {
      if (err) return res.status(401).json({ auth: false, message: 'Failed to authenticate token.' })

      User.findById(decoded._id).then((user) => {
        if (!user) return res.status(401).json({ auth: false, message: 'Failed to authenticate token.' })

        return res.status(200).json({ auth: true, message: 'Token is valid' })
      })
    });
  }

}