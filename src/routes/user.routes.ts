import { getUsers } from "../controllers/user.controller";
import express from "express";

const router = express.Router();

router.get("/", getUsers);

export default router;
