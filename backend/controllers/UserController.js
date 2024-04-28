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
//   }
//   export const updateUser = async (req, res) => {
//     try {
//         const { first_name, dob_day, dob_month, dob_year, show_gender, gender_identity, gender_interest, url, about, matches } = req.body;

//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             const errorMessages = errors.array().map(error => error.msg);
//             return res.status(400).json({ errors: errorMessages });
//         }

//         // Find the existing user by userId
//         setCookie('user_id',data.payload._id);

//         const existingUser = await usermodel.findById(req.userId);
//         console.log(cookie.user_id);
      
//         if (!existingUser) {
//             return res.status(404).json({
//                 message: "Користувача не знайдено"
//             });
//         }

//         // Update user fields
//         existingUser.first_name = first_name;
//         existingUser.dob_day = dob_day;
//         existingUser.dob_month = dob_month;
//         existingUser.dob_year = dob_year;
//         existingUser.show_gender = show_gender;
//         existingUser.gender_identity = gender_identity;
//         existingUser.gender_interest = gender_interest;
//         existingUser.url = url;
//         existingUser.about = about;
//         existingUser.matches = matches;

//         // Save the updated user in the database
//         const updatedUser = await existingUser.save();

//         res.json({ message: 'Користувача успішно оновлено', user: updatedUser });
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ message: 'Помилка при оновленні користувача' });
//     }
// };

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