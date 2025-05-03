import { Request, Response } from "express";
import User from "../models/user.model";
import generateToken from "../utils/generateToken";

export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const { fullName, password } = req.body;

    const existingUser = await User.findOne({
      email: req.body.email.toLowerCase(),
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({
      fullName,
      email: req.body.email.toLowerCase(),
      password,
    });
    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { password } = req.body;

    const user = await User.findOne({ email: req.body.email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Server error" });
  }
};
