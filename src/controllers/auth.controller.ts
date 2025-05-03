import { Request, Response } from "express";
import User from "../models/user.model";
import generateToken from "../utils/generateToken";

export const register = async (req: Request, res: Response) => {
  const { email, fullName, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res.status(400).json({ message: "User already exists" });

  const user = new User({ email, fullName, password });
  await user.save();

  const token = generateToken(user._id);
  res.status(201).json({
    token,
    user: {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
    },
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password)))
    return res.status(401).json({ message: "Invalid credentials" });

  const token = generateToken(user._id);
  res.status(200).json({ token, user: { ud: user._id, email: user.email } });
};
