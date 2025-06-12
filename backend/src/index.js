import express from "express";
import cors from "cors";
import connectDB from "./config/config";
import User from "./models/user";
import Product from "./models/product";

const app = express();
app.use(cors({
    origin: [
        "http://localhost:5173"
    ], 
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;
app.listen(port, () => {
    connectDB();
    console.log(`Server is running on port ${port}`);
});