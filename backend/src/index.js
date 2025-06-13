import express from "express";
import cors from "cors";
import connectDB from "./config/config.js";
import authRoute from "./routes/auth.js";
import productRouter from "./routes/product.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
import bcrypt from "bcrypt";
import User from "./models/user.js";
import path from "path";
dotenv.config();

const app = express();
app.use(cors({
    origin: [
        "http://localhost:5173","http://localhost:3000" 
    ], 
    credentials: true,
}));
app.use(cookieParser());

const __dirname = path.resolve();
if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req,res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    })
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoute);
app.use("/api/product", productRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    connectDB();
    console.log(`Server is running on port ${port}`);
});