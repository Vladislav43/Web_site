import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { check, validationResult } from 'express-validator';

import usermodel from '../models/User.js';

export const register = async (req, res) => {
    try {
        await Promise.all([
            check('fullname', 'Поле "Повне ім\'я" обов\'язкове для заповнення').notEmpty().run(req),
            check('email', 'Неправильний формат електронної пошти').isEmail().run(req),
            check('password', 'Пароль має містити щонайменше 6 символів').isLength({ min: 6 }).run(req)
        ]);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(400).json({ errors: errorMessages });
        }

        const { fullname, email, password, avatarurl } = req.body;

        const existingUser = await usermodel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ errors: ["Користувач з такою електронною поштою вже існує"] });
        }
     

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const newUser = new usermodel({
            email,
            passwordhash: hash,
            fullname,
            avatarurl,
        });

        const savedUser = await newUser.save();

        const token = jwt.sign(
            {
                _id: savedUser._id,
            },
            'secret123',
            {
                expiresIn: '30d'
            }
        );

        const { passwordhash, ...userData } = savedUser._doc;

        res.json({
            ...userData,
            token
        });

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не вдалося зареєструватися'
        })
    }
}
export const login = async (req, res) => {
    try{
      const user = await usermodel.findOne({ email: req.body.email});
  
      if (!user) {
        return res.status(404).json({
          message: "Неправильний логін, або пароль",
        });
      }
  
      const isvalidpass = await bcrypt.compare(req.body.password, user._doc.passwordhash);
  
      if (!isvalidpass) {
        return res.status(404).json({
          message: "Неправильний логін, або пароль",
        });
      }
  
      const token = jwt.sign(
        {
          _id: user._id,
        },
          'secret123',
        {
          expiresIn: '30d'
        }
      );
  
      const {passwordhash, ...userData} = user._doc;
  
      res.json({
        ...userData,
        token
      });
  
    } catch (err){
      console.log(err)
      res.status(500).json({
        message: "Не вдалося авторизуватися",
      });
    }
  }
export const getmy = async (req, res) => {
    try {
      const user = await usermodel.findById(req.userId);
  
      console.log(user)
  
      if (!user) {
        return res.status(404).json({
          message: "Користувача не знайдено"
        });
      }
      const { passwordhash, ...userData } = user._doc;
  
      res.json({ userData });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Не вдалося знайти користувача"
      });
    }
  }
