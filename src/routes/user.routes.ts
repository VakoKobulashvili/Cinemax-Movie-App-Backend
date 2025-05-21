import { protect } from "../middlewares/auth.middleware";
import { getUser, getUsers, updateUser } from "../controllers/user.controller";
import express from "express";

const router = express.Router();

router.get("/users", protect, getUsers);
router.get("/me", protect, getUser);
router.put("/me", protect, updateUser);

export default router;
