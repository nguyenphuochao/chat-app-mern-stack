export const authMe = async (req, res) => {
    try {
        const user = req.user;
        return res.status(200).json({ user });
    } catch (error) {
        console.log("Lỗi khi gọi authMe", error);
        return res.status(500).json({ message: "Có lỗi xảy ra" })
    }
}

export const test = (req, res) => {
    try {
        return res.sendStatus(204);
    } catch (error) {
        console.log(error);
    }
}