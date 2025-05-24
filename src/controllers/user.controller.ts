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
    const {
      fullName,
      email,
      currentPassword,
      newPassword,
      confirmNewPassword,
      avatar,
    } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    let isChanged = false;

    const profileUpdates: any = {};

    if (fullName !== undefined) {
      if (fullName === user.fullName) {
        return res.status(400).json({
          message: "New full name must not match the old one.",
        });
      }
      profileUpdates.fullName = fullName;
    }

    if (email !== undefined) {
      const lowerEmail = email.toLowerCase();
      if (lowerEmail === user.email) {
        return res.status(400).json({
          message: "New email must not match the old one.",
        });
      }
      const existing = await User.findOne({ email: lowerEmail });
      if (existing) {
        return res.status(400).json({ message: "Email already in use." });
      }
      profileUpdates.email = lowerEmail;
    }

    if (avatar !== undefined) {
      if (avatar === user.avatar) {
        return res.status(400).json({
          message: "New avatar must not match the old one.",
        });
      }
      profileUpdates.avatar = avatar;
    }

    if (Object.keys(profileUpdates).length > 0) {
      Object.assign(user, profileUpdates);
      isChanged = true;
    }

    const isPasswordUpdate =
      currentPassword && newPassword && confirmNewPassword;

    if (isPasswordUpdate) {
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect." });
      }

      if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ message: "Passwords do not match!" });
      }

      if (currentPassword === newPassword) {
        return res.status(400).json({
          message: "New password must not match the current password.",
        });
      }

      user.password = newPassword;
      isChanged = true;
    }

    if (!isChanged) {
      return res.status(400).json({
        message: "No changes detected. Please modify at least one field.",
      });
    }

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
