import { Response } from "express";
import AuthRequest from "../interfaces/AuthRequest.interface";
import User from "../models/user.model";

export const addToWishlist = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    const { movieId } = req.body;

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.wishlist.includes(movieId)) {
      return res.status(409).json({ message: "Movie is already in wishlist" });
    }

    user.wishlist.push(movieId);
    await user.save();

    res.status(200).json(user.wishlist);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const removeFromWishlist = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    const { movieId } = req.body;

    if (!user) return res.status(404).json({ message: "User not found" });

    user.wishlist = user.wishlist.filter((id) => id !== movieId);
    await user.save();

    res.status(200).json(user.wishlist);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
