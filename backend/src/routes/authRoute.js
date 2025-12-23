import express from "express";
import { signUp } from "../controllers/AuthController.js";

const authRoute = express.Router();

authRoute.get("/signup", signUp)

export default authRoute