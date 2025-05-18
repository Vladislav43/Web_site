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
            likes : 0
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
    user.telegramUrl = formData.telegramUrl; 
    user.instagramUrl = formData.instagramUrl;
    user.likes = 0;
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
};export const updateLikes = async (req, res) => {
  const { userId, liked } = req.body;

  try {
      // Перевірка правильності формату userId
      await check('userId', 'Неправильний формат ID користувача').isMongoId().run(req);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          const errorMessages = errors.array().map(error => error.msg);
          return res.status(400).json({ errors: errorMessages });
      }

      // Знаходження користувача за userId
      const user = await usermodel.findById(userId);
      if (!user) {
          return res.status(404).json({ message: "Користувача не знайдено" });
      }

      // Перевірка, чи користувач вже натиснув на сердечко
      if (liked) {
          user.likes = (user.likes || 1) + 1; // Додати 1 до кількості лайків, або почати з 0, якщо значення не ініціалізовано
      } else {
          // Якщо користувач відмінив лайк, відніміть 1 від кількості лайків, якщо вона вже існує і більше 0
          if (user.likes && user.likes > 0) {
              user.likes -= 1;
          }
      }

      // Збереження змін у базі даних
      const savedUser = await user.save();

      res.json(savedUser);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Помилка при оновленні кількості сердечок' });
  }
};

/**
 * Алгоритм персоналізованого підбору партнера
 * GET /recommend-partner
 * Повертає масив найбільш релевантних користувачів для поточного користувача
 * 
 * Вхід: req.userId (авторизований користувач)
 * Вихід: масив користувачів, відсортований за релевантністю
 */
export const recommendPartner = async (req, res) => {
  try {
    // 1. Знайти поточного користувача
    const currentUser = await usermodel.findById(req.userId);
    if (!currentUser) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    // 2. Витягнути всіх інших користувачів, крім себе
    const allUsers = await usermodel.find({ _id: { $ne: req.userId } });

    // 3. Функція для підрахунку релевантності (чим більше - тим краще)
    function getScore(user) {
      let score = 0;

      // Гендерна відповідність
      if (
        user.gender_identity === currentUser.gender_interest &&
        user.gender_interest === currentUser.gender_identity
      ) {
        score += 30;
      } else if (
        user.gender_identity === currentUser.gender_interest
      ) {
        score += 15;
      }

      // Вік (чим ближче, тим краще)
      if (user.dob_year && currentUser.dob_year) {
        const ageDiff = Math.abs(user.dob_year - currentUser.dob_year);
        if (ageDiff <= 2) score += 20;
        else if (ageDiff <= 5) score += 10;
        else if (ageDiff <= 10) score += 5;
      }

      // Соцмережі
      if (user.instagramUrl) score += 3;
      if (user.telegramUrl) score += 3;

      // Спільні слова в about
      if (user.about && currentUser.about) {
        const userWords = user.about.toLowerCase().split(/\W+/);
        const myWords = currentUser.about.toLowerCase().split(/\W+/);
        const common = userWords.filter(word => myWords.includes(word));
        score += Math.min(common.length * 2, 10); // максимум 10 балів
      }

      // Популярність (лайки)
      if (user.likes) score += Math.min(user.likes, 10);

      // Пріоритет користувачам з фото
      if (user.url) score += 5;

      // Пріоритет користувачам, які заповнили анкету
      if (user.about && user.gender_identity && user.gender_interest && user.dob_year) score += 5;

      return score;
    }

    // 4. Порахувати score для кожного користувача
    const usersWithScore = allUsers.map(user => ({
      ...user._doc,
      score: getScore(user)
    }));

    // 5. Відсортувати за score (від більшого до меншого)
    usersWithScore.sort((a, b) => b.score - a.score);

    // 6. Повернути топ-10 (або всі, якщо менше)
    res.json(usersWithScore.slice(0, 10));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Помилка при підборі партнера" });
  }
};
