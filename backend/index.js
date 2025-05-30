import express from 'express';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';
import { registerValidation } from './validations/auth.js';
import * as UserController from './controllers/UserController.js'; 
import cors from "cors"
import checkauth from './utils/checkauth.js';
import chatRoutes from './routes/chat.js'; // якщо у chat.js є export default router;
// або
// import chatRoutes from './routes/chat.js'; // якщо у chat.js є module.exports = router;

// Якщо у вас CommonJS (require/module.exports), змініть імпорт так:
// <-- Видалено дубльований імпорт chatRoutes -->

// Додайте імпорт для socket.io
import { Server } from 'socket.io';
import http from 'http';

mongoose.connect('')
.then(()=> console.log('db ok'))
.catch((err)=>console.log('Db error'))
const app = express();
app.use(express.json({ limit: '50mb' }));
const port = 7300;
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.post('/auth/register', registerValidation, UserController.register);
app.post('/auth/login', UserController.login);

app.get('/auth/me', checkauth, UserController.getmy);
app.put('/updateUser', UserController.updateUser);
app.post('/updateLikes',UserController.updateLikes);
app.get('/anceta',UserController.getAllUsers);

// Додаємо підключення роуту чату
app.use('/chat', chatRoutes);

// --- Додаємо socket.io сервер ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

import ChatMessage from './models/ChatMessage.js';

io.on('connection', (socket) => {
  // Відправити всі повідомлення при підключенні
  socket.on('getAllMessages', async () => {
    const msgs = await ChatMessage.find().sort({ createdAt: 1 });
    socket.emit('chatMessages', msgs);
  });

  // Відправити нове повідомлення всім підключеним
  socket.on('chatMessage', (msg) => {
    socket.broadcast.emit('chatMessage', msg);
  });
});

// --- Запускаємо сервер через server.listen ---
server.listen(port, function (err) {
  if (err) {
    return console.log(err);
  }
  console.log(`Server is running on port ${port}`);
});

// --- Видаліть або закоментуйте старий app.listen ---
// app.listen(port, function (err) { ... });
