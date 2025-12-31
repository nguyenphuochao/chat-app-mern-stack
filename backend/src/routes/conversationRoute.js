import express from 'express'
import { createConversation } from '../controllers/conversationController.js';
import { checkFriendShip } from '../middlewares/friendMiddleware.js';

const router = express.Router();

router.post('/', checkFriendShip, createConversation);

export default router;