import express from "express";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import jwtAuth from "../middleware/jwtAuth.js";

const authRoute = express.Router();
const generateToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1d" });

authRoute.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            res.status(401).json({ message: "All fields are required!!" });
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({ message: "User not found!" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(401).json({message:"Incorrect pasword"});

        const token  = generateToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
        })

        return res.status(200).json({
        message: "Login successful!",
        user: { id: user._id, name: user.name, email: user.email },
        token,
    });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})

authRoute.post("/addUser", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();

    return res.status(201).json({
      message: "User added successfully!",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });

  } catch (error) {
    console.error("Error in adding user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


authRoute.post("/logout", (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logout successful." });
});

authRoute.get("/check", jwtAuth(), (req, res) => {
  const token = req.cookies.token;
  console.log("token : ", token);
  
  if (!token) {
    return res.status(200).json(null);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    return res.status(200).json(req.user);
  } catch (err) {
    return res.status(200).json(null);
  }
});

export default authRoute;