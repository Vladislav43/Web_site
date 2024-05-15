import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { check, cookie, validationResult } from 'express-validator';

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

// Update a User in the Database
export const updateUser = async (req, res) => {
  const formData = req.body;
  console.log("-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*");
console.log(formData);
  try {
    const user = await usermodel.findOne({ _id: req.body.user_id});
   // const user = await usermodel.findById(req.userId); 

    console.log("user : ",user);
    console.log("-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*");
    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }
    

    // Оновлюємо поля користувача на основі formData
    user.fullname = formData.first_name;
    user.dob_day = formData.dob_day;
    user.dob_month = formData.dob_month;
    user.dob_year = formData.dob_year;
    user.show_gender = formData.show_gender;
    user.gender_identity = formData.gender_identity;
    user.gender_interest = formData.gender_interest;
    user.url = formData.url;
    user.about = formData.about;
    user.matches = formData.matches;

    // Зберігаємо оновлений документ користувача у базі даних
    const updatedUser = await user.save();

    res.json({ message: 'Користувача успішно оновлено', user: updatedUser });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Помилка при оновленні користувача' });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await usermodel.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Не вдалося отримати користувачів' });
  }
};
// export const messages = async (req, res) => {
//   const user = await User.findById(userId);
// const correspondingUser = await User.findById(correspondingUserId);
//   const { userId, correspondingUserId } = req.query;

//   try {
//     const user = await User.findById(userId);
//     const correspondingUser = await User.findById(correspondingUserId);

//     if (!user || !correspondingUser) {
//       return res.status(404).json({ message: 'Користувача не знайдено' });
//     }

//     const messages = user.messages.filter(
//       (message) =>
//         (message.from_userId.equals(userId) && message.to_userId.equals(correspondingUserId)) ||
//         (message.from_userId.equals(correspondingUserId) && message.to_userId.equals(userId))
//     );

//     res.json(messages);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Помилка при отриманні повідомлень' });
//   }
// };

// export const message = async (req, res) => {
//   const user = await User.findById(userId);
// const correspondingUser = await User.findById(correspondingUserId);
//   const { userId, correspondingUserId, message } = req.body;

//   try {
//     const user = await User.findById(userId);
//     const correspondingUser = await User.findById(correspondingUserId);

//     if (!user || !correspondingUser) {
//       return res.status(404).json({ message: 'Користувача не знайдено' });
//     }

//     user.messages.push({
//       from_userId: userId,
//       to_userId: correspondingUserId,
//       message
//     });

//     const updatedUser = await user.save();

//     res.json(updatedUser.messages);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Помилка при додаванні повідомлення' });
//   }
// };