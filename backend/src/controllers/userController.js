import User from "../models/User.js"

export const authMe = async (req, res) => {
    try {
        const user = req.user;
        return res.status(200).json({ user });
    } catch (error) {
        console.log("Lỗi khi gọi authMe", error);
        return res.status(500).json({ message: "Có lỗi xảy ra" })
    }
}

export const searchUserByUsername = async (req, res) => {
    try {
        const { username } = req.query

        if (!username || username.trim() === "") {
            return res.status(400).json({ message: "Cần cung cấp username trong query" });
        }

        const user = await User.findOne({ username }).select("_id username displayName avatarUrl");

        return res.status(200).json({ user });
    } catch (error) {
        console.log("Lỗi khi gọi searchUserByUsername", error);
        return res.status(500).json({ message: "Có lỗi xảy ra" })
    }
}