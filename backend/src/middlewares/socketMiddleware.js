import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const socketAuthMiddleware = async (socket, next) => {
    try {
        const token = socket.handshake.auth?.token;
        if(!token) {
            return next(new Error('Unauthorized - Token không tồn tại'));
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if(!decoded) {
            return next(new Error('Unauthorized - Token không hợp lệ or đã hết hạn'));
        }

        const user = await User.findById(decoded.userId).select('-hashPassword');

        if(!user) {
            return next(new Error('Không tìm thấy người dùng'));
        }

        socket.user = user;

        next();
    } catch (error) {
        console.error("Lỗi khi xác minh socketAuthMiddleware", error);
        next(new Error("Unauthorized"))
    }
}