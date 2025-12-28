import FriendRequest from "../models/FriendRequest.js";
import Friend from "../models/Friend.js";
import User from "../models/User.js";

// Send a friend request.
export const sendFriendRequest = async (req, res) => {
    try {
        // get request body
        const { to, message } = req.body

        const from = req.user._id

        if (from == to) {
            return res.status(400).json({ message: "Không thể gửi lời mời kết bạn cho chính mình" });
        }

        // check user exists
        const userExists = await User.exists({ _id: to });

        if (!userExists) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        let userA = from.toString();
        let userB = to.toString();

        if (userA > userB) {
            [userA, userB] = [userB, userA];
        }

        const [alreadyFriends, existsRequest] = await Promise.all([
            Friend.findOne({ userA, userB }),
            FriendRequest.findOne({
                $or: [
                    { from, to },
                    { from: to, to: from }
                ]
            })
        ]);

        if (alreadyFriends) {
            return res.status(400).json({ message: "Hai người đã là bạn bè" });
        }

        if (existsRequest) {
            return res.status(400).json({ message: "Đã có lời mời kết bạn đang chờ" });
        }

        // create friend request
        const request = await FriendRequest.create({
            from,
            to,
            message
        });

        // return
        return res.status(201).json({ message: "Gửi lời mời kết bạn thành công", request })
    } catch (error) {
        console.log("Lỗi khi gửi sendFriendRequest", error);
        return res.status(500).json({ message: "Lỗi hệ thống" })
    }
}

export const acceptFriendRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const userId = req.user._id; // account current login

        const request = await FriendRequest.findById(requestId);

        if (!request) {
            return res.status(404).json({ message: "Không tìm thấy lời mời kết bạn" });
        }

        if (request.to.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Bạn không có quyền chấp nhận lời mời kết bạn này" });
        }

        // create new friend
        await Friend.create({
            userA: request.from,
            userB: request.to
        });

        // delete friend request
        await FriendRequest.findByIdAndDelete(requestId);

        const from = await User.findById(request.from).select("_id displayName avatarUrl").lean();

        // return
        return res.status(200).json({
            message: "Chấp nhận lời mời kết bạn thành công",
            newFriend: {
                "_id": from?._id,
                "displayName": from?.displayName,
                "avatarUrl": from?.avatarUrl
            }
        })
    } catch (error) {
        console.log("Lỗi khi acceptFriendRequest", error);
        return res.status(500).json({ message: "Lỗi hệ thống" })
    }
}

export const declineFriendRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const userId = req.user._id; // account current login

        const request = await FriendRequest.findById(requestId);

        if (!request) {
            return res.status(404).json({ message: "Không tìm thấy lời mời kết bạn" });
        }

        if (request.to.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Bạn không có quyền từ chối mời kết bạn này" });
        }

        // delete(deaccept) friend request
        await FriendRequest.findByIdAndDelete(requestId);

        // return
        return res.sendStatus(204)
    } catch (error) {
        console.log("Lỗi khi deacceptFriendRequest", error);
        return res.status(500).json({ message: "Lỗi hệ thống" })
    }
}

export const getAllFriends = async (req, res) => {
    try {
        // account current login
        const userId = req.user._id;

        // Inner join collection
        const friendShips = await Friend.find({
            $or: [
                { userA: userId },
                { userB: userId }
            ]
        })
            .populate("userA", "_id displayName avatarUrl")
            .populate("userB", "_id displayName avatarUrl")
            .lean()

        // No friends 
        if (!friendShips.length) {
            return res.status(200).json({ friends: [] })
        }

        // Have friends
        const friends = friendShips.map((f) => f.userA._id.toString() === userId.toString() ? f.userB : f.userA);

        // return
        return res.status(200).json({ friends })
    } catch (error) {
        console.log("Lỗi khi gọi getAllFriends", error);
        return res.status(500).json({ message: "Lỗi hệ thống" })
    }

}

export const getFriendRequests = async (req, res) => {
    try {
        // account current login
        const userId = req.user._id;

        const populateFields = "_id displayName avatarUrl";

        // Join collection query
        const [sent, received] = await Promise.all([
            FriendRequest.find({ from: userId }).populate("to", populateFields),
            FriendRequest.find({ to: userId }).populate("from", populateFields)
        ])

        return res.status(200).json({ sent, received })
    } catch (error) {
        console.log("Lỗi khi gọi getFriendRequests", error);
        return res.status(500).json({ message: "Lỗi hệ thống" })
    }
}