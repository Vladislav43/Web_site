import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';

import { registerValidation } from './validations/auth.js';

import usermodel from './models/User.js';
import checkauth from './utils/checkauth.js';
import User from './models/User.js';


mongoose.connect('mongodb+srv://voievoda:orewit123.@cluster0.hjg23dj.mongodb.net/blog?retryWrites=true&w=majority')
.then(()=> console.log('db ok'))
.catch((err)=>console.log('Db error'))
const app = express();
const port = 41434;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.post('/auth/register', registerValidation, async (req, res) => {
  try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new usermodel({
      email: req.body.email,
      passwordhash: hash,
      fullname: req.body.fullname,
      avatarurl: req.body.avatarurl,
    })

    const user = await doc.save();

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
      message: 'Не вдалося зареєструватися'
    })
  }
});

app.post('/auth/login', async (req, res) => {
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
});

app.get('/auth/me', checkauth, async (req, res) =>{
  try{
        const user = await usermodel.findById(req.userId);

        console.log(user)

        if (!user) {
          return res.status(404).json({
            message: "Користувача незнайдено"
          })
        }
        const {passwordhash, ...userData} = user._doc;

        res.json({userData});
      
  } catch (err){
    console.log(err)
    res.status(500).json({
      message: "Не вдалося знайти користувача",
    });
  }
})

app.listen(port, function (err) {
  if (err) {
    return console.log(err);
  }

  console.log(`Server is running on port ${port}`);

});