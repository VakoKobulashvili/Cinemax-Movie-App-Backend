import {
  addToWishlist,
  removeFromWishlist,
} from "../controllers/wishlist.controller";
import express from "express";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/wishlist/add", protect, addToWishlist);
router.delete("/wishlist/remove/:movieId", protect, removeFromWishlist);

export default router;
