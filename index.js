import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';

import { registerValidation } from './validations/auth.js';

mongoose.connect('mongodb+srv://voievoda:orewit123.@cluster0.hjg23dj.mongodb.net/?retryWrites=true&w=majority')
.then(()=> console.log('db ok'))
.catch((err)=>console.log('Db error'))
const app = express();
const port = 41434;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.post('/auth/register', registerValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  res.json({
    success: true,
  })
});

app.listen(port, function (err) {
  if (err) {
    return console.log(err);
  }

  console.log(`Server is running on port ${port}`);

});