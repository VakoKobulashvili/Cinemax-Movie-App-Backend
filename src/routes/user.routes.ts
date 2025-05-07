import { protect } from "../middlewares/auth.middleware";
import { getUser, getUsers } from "../controllers/user.controller";
import express from "express";

const router = express.Router();

router.get("/users", protect, getUsers);
router.get("/me", protect, getUser);

export default router;
