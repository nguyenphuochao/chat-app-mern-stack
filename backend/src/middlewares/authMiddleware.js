import jwt from "jsonwebtoken"
import User from "../models/User.js";

export const protectedRoute = (req, res, next) => {
    try {
        // get token header
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

        if (!token) {
            return res.status(401).json({ message: "Không tìm thấy access token" });
        }

        // verify valid token
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedUser) => {
            if (err) {
                return res.status(403).json({ message: "Access token hết hạn hoặc không hợp lệ" });
            }

            // find user
            const user = await User.findById(decodedUser.userId).select("-hashPassword");

            if (!user) {
                return res.status(404).json({ message: "Không tìm thấy người dùng" });
            }

            // return the user in the request.
            req.user = user;
            next();
        })
    } catch (error) {
        console.log("Lỗi xảy ra khi xác minh JWT trong auMiddleware", error);
        return res.status(500).json({ message: "Có lỗi xảy ra" });
    }
}