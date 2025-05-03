import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import User from "../models/user.model";

interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as {
      id: string;
    };

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export const validate = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validateRegister = [
  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("A valid email address is required.")
    .normalizeEmail(),

  body("fullName")
    .notEmpty()
    .withMessage("Full name is required.")
    .isLength({ min: 3 })
    .withMessage("Full name must be at least 3 characters."),

  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 6, max: 12 })
    .withMessage("Password must be between 6 and 12 characters."),
];

export const validateLogin = [
  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("A valid email address is required.")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 6, max: 12 })
    .withMessage("Password must be between 6 and 12 characters"),
];
