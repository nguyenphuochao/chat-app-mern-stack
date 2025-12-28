import bcrypt from "bcrypt"
import User from "../models/User.js"
import Session from "../models/Session.js"
import jwt from "jsonwebtoken"
import crypto from "crypto"

const ACCESS_TOKEN_TTL = "300000000000000m"; // 30 minutes
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // 14 days

export const signUp = async (req, res) => {
    try {
        const { username, email, password, firstName, lastName } = req.body

        // validate
        if (!username || !email || !password || !firstName || !lastName) {
            return res.status(400).json({ message: "Không thể thiếu username, email, password, firstName, lastName" })
        }

        // check user exists
        const userExists = await User.findOne({ username });

        if (userExists) {
            return res.status(409).json({ message: "username đã tồn tại. Vui lòng thử tên khác" })
        }

        // hash password
        const hashPassword = await bcrypt.hash(password, 10); // salt = 10

        // create new user
        await User.create({
            username,
            hashPassword,
            email,
            displayName: `${firstName} ${lastName}`
        })

        // return
        return res.sendStatus(204);
    } catch (error) {
        console.log("Lỗi khi gọi signUp", error);
        return res.status(500).json({ message: "Có lỗi xảy ra" })
    }
}

export const signIn = async (req, res) => {
    try {
        // get inputs body
        const { username, password } = req.body

        // validate
        if (!username || !password) {
            return res.status(400).json({ message: "Thiếu username, password" });
        }

        // check username valid
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: "Sai thông tin đăng nhập" });
        }

        // check password valid
        const checkComparePassword = await bcrypt.compare(password, user.hashPassword);

        if (!checkComparePassword) {
            return res.status(401).json({ message: "Sai thông tin đăng nhập" });
        }

        // create accessToken with JWT
        const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_TTL });

        // create refresh token
        const refreshToken = crypto.randomBytes(64).toString("hex");

        // create new session save refresh token in DB
        await Session.create({
            userId: user._id,
            refreshToken,
            expiresAt: Date.now() + REFRESH_TOKEN_TTL
        });

        // return refreshToken to cookies
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, // không thể truy cập bằng javascript
            secure: true,// đảm bảo gửi qua https
            samSite: 'none', // cho phép BE và FE truy cập bằng 2 domain khác nhau
            maxAge: REFRESH_TOKEN_TTL
        })

        // return accessToken to response
        return res.status(200).json({
            message: `User ${user.displayName} đã login`,
            accessToken
        })
    } catch (error) {
        console.log("Lỗi khi gọi signIn", error);
        return res.status(500).json({ message: "Có lỗi xảy ra" })
    }
}

export const signOut = async (req, res) => {
    try {
        // get refreshToken from cookie
        const token = req.cookies?.refreshToken;

        if (token) {
            // clear refreshToken in cookie
            res.clearCookie('refreshToken');
            // clear refreshToken in Session DB
            await Session.deleteOne({ refreshToken: token });
        }

        return res.sendStatus(204);
    } catch (error) {
        console.log("Lỗi khi gọi signOut", error);
        return res.status(500).json({ message: "Có lỗi xảy ra" })
    }
}

// create new accessToken from refreshToken
export const refreshToken = async (req, res) => {
    try {
        // get refreshToken from cookie
        const token = req.cookies?.refreshToken;

        if (!token) {
            return res.status(401).json({ message: "Không tìm thấy token" })
        }

        // check refreshToken in DB Session
        const session = await Session.findOne({ refreshToken: token });

        if (!session) {
            return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn" })
        }

        // check expires at
        if (session.expiresAt < Date.now()) {
            return res.status(403).json({ message: "Token đã hết hạn" })
        }

        // create new accessToken
        const accessToken = jwt.sign({ userId: session.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_TTL });

        // return
        return res.status(200).json({ accessToken })
    } catch (error) {
        console.log("Lỗi khi gọi refreshToken", error);
        return res.status(500).json({ message: "Có lỗi xảy ra" })
    }
}