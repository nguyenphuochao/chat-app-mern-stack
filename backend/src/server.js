import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./libs/db.js";

// authRoute
import authRoute from "./routes/authRoute.js";

// load .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// middleware
app.use(express.json()); // support body request json

// public routes
app.use("/api/auth", authRoute);

// private routes


// start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`server start port ${PORT}`);
    })
})
