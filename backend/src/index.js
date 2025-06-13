import express from "express";
import cors from "cors";
import connectDB from "./config/config.js";
import authRoute from "./routes/auth.js";
import productRouter from "./routes/product.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
import bcrypt from "bcrypt";
import User from "./models/user.js";
dotenv.config();

const app = express();
app.use(cors({
    origin: [
        "http://localhost:5173","http://localhost:3000" 
    ], 
    credentials: true,
}));
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoute);
app.use("/api/product", productRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    connectDB();
    console.log(`Server is running on port ${port}`);
});