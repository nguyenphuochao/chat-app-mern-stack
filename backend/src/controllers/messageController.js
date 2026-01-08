import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { updateConversationAfterCreateMessage } from "../utils/messageHelper.js";

export const sendDirectMessage = async (req, res) => {
    try {
        const { recipientId, content, conversationId } = req.body;
        const senderId = req.user._id;

        let conversation;

        if (!content) {
            return res.status(400).json({ message: "Vui lòng nhập nội dung tin nhắn" });
        }

        if (conversationId) {
            conversation = await Conversation.findById(conversationId);
        }

        if (!conversation) {
            conversation = await Conversation.create({
                type: "direct",
                participants: [
                    { userId: senderId, joinAt: new Date() },
                    { userId: recipientId, joinAt: new Date() }
                ],
                lastMessageAt: new Date(),
                unreadCounts: new Map()
            });
        }

        // create message
        const message = await Message.create({
            conversationId: conversation._id,
            senderId,
            content
        });

        updateConversationAfterCreateMessage(conversation, message, senderId);

        await conversation.save();

        // return
        return res.status(201).json({ message });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}

export const sendGroupMessage = async (req, res) => {
    try {
        const { conversationId, content } = req.body;
        const senderId = req.user._id;
        const conversation = req.conversation;

        if (!content) {
            return res.status(400).json({ message: "Vui lòng nhập nội dung tin nhắn" });
        }

        const message = await Message.create({
            conversationId,
            senderId,
            content
        });

        updateConversationAfterCreateMessage(conversation, message, senderId);

        await conversation.save();

        return res.status(201).json({ message });
    } catch (error) {
        console.log("Lỗi xảy ra khi gọi sendGroupMessage", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}