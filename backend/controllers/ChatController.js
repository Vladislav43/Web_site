import ChatMessage from '../models/ChatMessage.js';
import User from '../models/User.js'; // Додаємо імпорт User

// Отримати всі повідомлення
export const getMessages = async (req, res) => {
  try {
    const messages = await ChatMessage.find().sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Помилка при отриманні повідомлень' });
  }
};

// Додати нове повідомлення
export const postMessage = async (req, res) => {
  try {
    const { text, time, user, avatar } = req.body;
    if (!text || !user || !time) {
      return res.status(400).json({ message: 'Всі поля обовʼязкові' });
    }

    let userFullname = user;
    let userAvatar = avatar || '';

    // Якщо є токен авторизації, шукаємо користувача
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      const token = req.headers.authorization.split(' ')[1];
      // Дістаємо користувача по токену (можливо, через middleware або jwt.verify)
      // Тут простий варіант: якщо в req.user є id (middleware має додати)
      if (req.user && req.user._id) {
        const dbUser = await User.findById(req.user._id).select('fullname avatarUrl');
        if (dbUser) {
          userFullname = dbUser.fullname;
          userAvatar = dbUser.avatarUrl || '';
        }
      }
    }

    const msg = new ChatMessage({
      text,
      time,
      user: userFullname,
      avatar: userAvatar,
    });
    await msg.save();
    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ message: 'Помилка при збереженні повідомлення' });
  }
};
