import bcrypt from "bcrypt"
import User from "../models/User.js"

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
        res.status(500).json({ message: "Có lỗi xảy ra" })
    }
}

export const signIn = async () => {
    try {
        const { username, password } = req.body

        // validate
        if (!username || !password) {
            return res.status(400).json({ message: "Không thể thiếu username, password" });
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

        // create access token

        // return
    } catch (error) {
        console.log("Lỗi khi gọi signIn", error);
        res.status(500).json({ message: "Có lỗi xảy ra" })
    }
}