import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction, RequestHandler } from "express";

const editProfileRules: RequestHandler[] = [
  body("fullName")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Full name must be at least 3 characters."),

  body("email")
    .optional()
    .isEmail()
    .withMessage("A valid email address is required.")
    .normalizeEmail(),

  body("avatar").optional().isURL().withMessage("Avatar must be a valid URL."),
];

const requireAtLeastOneField = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const { fullName, email, avatar } = req.body;

  if (!fullName && !email && !avatar) {
    return res
      .status(400)
      .json({ message: "At least one field to change is required!" });
  }

  next();
};

const handleValidationErrors = (
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

export const validateEditProfile: RequestHandler[] = [
  requireAtLeastOneField,
  ...editProfileRules,
  handleValidationErrors,
];
