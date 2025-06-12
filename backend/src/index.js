import express from "express";
import cors from "cors";
import connectDB from "./config/config";
import User from "./models/user";
import Product from "./models/product";
import authRoute from "./routes/auth";
import productRouter from "./routes/product";

const app = express();
app.use(cors({
    origin: [
        "http://localhost:5173"
    ], 
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoute);
app.use("/product", productRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    connectDB();
    console.log(`Server is running on port ${port}`);
});