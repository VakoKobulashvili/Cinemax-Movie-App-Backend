import {
  validate,
  validateLogin,
  validateRegister,
} from "../middlewares/auth.middleware";
import { login, register } from "../controllers/auth.controller";
import express from "express";

const router = express.Router();

router.post("/register", validateRegister, validate, register);
router.post("/login", validateLogin, validate, login);

export default router;
