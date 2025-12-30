import Friend from '../models/Friend.js';

const pair = (a, b) => (a < b ? [a, b] : [b, a]);

export const checkFriendShip = async (req, res, next) => {
    try {
        // get current account login
        const me = req.user._id.toString();

        const recipientId = req.body?.recipientId ?? null;

        if (!recipientId) {
            return res.status(400).json({ message: "Cần cung cấp recipientId" })
        }

        if (recipientId) {
            const [userA, userB] = pair(me, recipientId);

            const isFriend = await Friend.findOne({ userA, userB });

            if (!isFriend) {
                return res.status(401).json({ message: "Chưa kết bạn với người này" })
            }

            return next();
        }

        // todo: chat group
    } catch (error) {
        console.log("Lỗi khi gọi middleware checkFriendShip", error);
        return res.status(500).json({ message: "Lỗi hệ thống" })
    }
}