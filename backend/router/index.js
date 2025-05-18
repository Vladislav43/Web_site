const Router = require('express').Router
const { getAllUsers, updateUser, recommendPartner } = require('../controllers/UserController');
const verifyToken = require('../utils/checkauth');

// Додаємо імпорт контролера чату
const { getMessages, postMessage } = require('../controllers/ChatController');

const router = new Router();

router.post('/registration');
router.post('/login');
router.post('/logout');
router.get('/activate/:link');
router.get('/refresh');
router.get('/anceta', getAllUsers);
router.put('/update', verifyToken, updateUser);

// Додаємо роут для персоналізованого підбору партнера
router.get('/recommend-partner', verifyToken, recommendPartner);

// Додаємо роут для чату (шлях БЕЗ /chat, бо app.use('/chat', ...) у index.js)
router.get('/messages', getMessages);
router.post('/messages', postMessage);

module.exports = router