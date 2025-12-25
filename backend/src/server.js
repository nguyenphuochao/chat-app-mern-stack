import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./libs/db.js";
import cookieParser from "cookie-parser";

// authRoute
import authRoute from "./routes/authRoute.js";
// userRoute
import userRoute from "./routes/userRoute.js";
import { protectedRoute } from "./middlewares/authMiddleware.js";

// load .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// middleware
app.use(express.json()); // support body request json
app.use(cookieParser());

// public routes
app.use("/api/auth", authRoute);

// private routes
app.use(protectedRoute);
app.use("/api/users", userRoute);

// start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`server start port ${PORT}`);
    })
})
