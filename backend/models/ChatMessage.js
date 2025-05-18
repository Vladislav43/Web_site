import mongoose from 'mongoose';

const ChatMessageSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    time: { type: String, required: true },
    user: { type: String, required: true },
  },
  { timestamps: true }
);

// Якщо модель вже існує — не створювати повторно (для hot-reload/розробки)
export default mongoose.models.ChatMessage || mongoose.model('ChatMessage', ChatMessageSchema);

// Модель визначена правильно, тут змін не потрібно.
// Якщо 404 — проблема не в цій моделі, а у роуті або підключенні контролера.
// Перевірте, що у вашому index.js (або app.js) є:
//
// import chatRoutes from './routes/chat.js';
// app.use('/chat', chatRoutes);
//
// І що файл routes/chat.js існує та містить:
//
// import express from 'express';
// import { getMessages, postMessage } from '../controllers/ChatController.js';
// const router = express.Router();
// router.get('/messages', getMessages);
// router.post('/messages', postMessage);
// export default router;
//
// Для вашої структури (router/index.js):
// 1. Переконайтесь, що у router/index.js є:
//
// const { getMessages, postMessage } = require('../controllers/ChatController');
// router.get('/chat/messages', getMessages);
// router.post('/chat/messages', postMessage);
//
// 2. У index.js (app.js) має бути:
//
// const mainRouter = require('./router/index');
// app.use('/', mainRouter);
//
// 3. Сервер має бути перезапущений.
//
// 4. Ваш фронтенд має звертатись до http://localhost:7300/chat/messages
//
// Якщо все це виконано — POST /chat/messages буде працювати.
//
// Якщо GET /chat/messages працює, а POST /chat/messages — ні:
// 1. Проблема не в цій моделі, а у роуті, контролері або body-parser (middleware).
// 2. Перевірте, що у вашому index.js/app.js є:
//    app.use(express.json()); // має бути ДО app.use('/', mainRouter);
// 3. Переконайтесь, що POST-запит надсилається з Content-Type: application/json.
// 4. Якщо GET працює, а POST — ні, то, ймовірно, сервер не отримує body або не бачить роут.
