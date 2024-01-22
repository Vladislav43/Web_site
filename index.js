import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

mongoose.connect('mongodb+srv://voievoda:orewit123.@cluster0.hjg23dj.mongodb.net/?retryWrites=true&w=majority')
.then(()=> console.log('db ok'))
.catch((err)=>console.log('Db error'))
const app = express();
const port = 41434;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.post('/auth/login', (req, res) => {
  
  const token = jwt.sign({
    email: req.body.email,
  }, 'hash');

  res.json({
    success: true,
    token: token, 
  });
});

app.listen(port, function (err) {
  if (err) {
    return console.log(err);
  }

  console.log(`Server is running on port ${port}`);
});
