import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./libs/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { protectedRoute } from "./middlewares/authMiddleware.js";

// authRoute
import authRoute from "./routes/authRoute.js";
// userRoute
import userRoute from "./routes/userRoute.js";
// friendRoute
import friendRoute from "./routes/friendRoute.js";
// messageRoute
import messageRoute from "./routes/messageRoute.js";

// load .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// middleware
app.use(express.json()); // support body request json
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// public routes
app.use("/api/auth", authRoute);

// private routes
app.use(protectedRoute);
app.use("/api/users", userRoute);
app.use("/api/friends", friendRoute);
app.use("/api/messages", messageRoute);

// start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`server start port ${PORT}`);
    })
})
