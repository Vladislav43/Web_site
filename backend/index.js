import express from 'express';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';
import { registerValidation } from './validations/auth.js';
import * as UserController from './controllers/UserController.js'; 
import cors from "cors"
import checkauth from './utils/checkauth.js';

mongoose.connect('mongodb+srv://voievoda:orewit123.@cluster0.hjg23dj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(()=> console.log('db ok'))
.catch((err)=>console.log('Db error'))
const app = express();
app.use(express.json({ limit: '50mb' }));
const port = 7300;
app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.post('/auth/register', registerValidation, UserController.register);
app.post('/auth/login', UserController.login);

app.get('/auth/me', checkauth, UserController.getmy);
app.put('/updateUser', UserController.updateUser);
app.post('/updateLikes',UserController.updateLikes)
// app.get('/messages', UserController.messages); // додано ()
// app.post('/message', UserController.message);
app.get('/anceta',UserController.getAllUsers);
app.listen(port, function (err) {
  if (err) {
    return console.log(err);
  }

  console.log(`Server is running on port ${port}`);

});