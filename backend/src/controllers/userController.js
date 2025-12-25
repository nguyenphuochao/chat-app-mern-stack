export const authMe = async (req, res) => {
    try {
        const user = req.user;
        return res.status(200).json({
            "id": user._id,
            "username": user.username,
            "email": user.email,
            "displayName": user.displayName,
            "createdAt": user.createdAt,
            "updatedAt": user.updatedAt
        });
    } catch (error) {
        console.log("Lỗi khi gọi authMe", error);
        return res.status(500).json({ message: "Có lỗi xảy ra" })
    }
}