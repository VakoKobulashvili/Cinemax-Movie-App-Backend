import { Request, Response } from "express";
import User from "../models/user.model";
import AuthRequest from "../interfaces/AuthRequest.interface";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error });
  }
};

export const getUser = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const user = await User.findOne({ _id: req.user._id });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      avatar: user.avatar,
      email: user.email,
      fullName: user.fullName,
      wishlist: user.wishlist,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUser = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const { fullName, email, password, avatar } = req.body;
    const user = await User.findOne({ _id: req.user._id });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (email && email.toLowerCase() !== user.email) {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        return res.status(400).json({ message: "Email already in use." });
      }
      user.email = email.toLowerCase();
    }

    if (fullName) user.fullName = fullName;
    if (password) user.password = password;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.json({
      message: "User updated successfully!",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update user!", error });
  }
};
