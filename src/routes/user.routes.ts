import { protect } from "../middlewares/auth.middleware";
import { getUsers } from "../controllers/user.controller";
import express from "express";

const router = express.Router();

router.get("/", protect, getUsers);

export default router;
