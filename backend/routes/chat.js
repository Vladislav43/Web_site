import express from 'express';
import { getMessages, postMessage } from '../controllers/ChatController.js';

const router = express.Router();

router.get('/messages', getMessages);
router.post('/messages', postMessage);

export default router;
