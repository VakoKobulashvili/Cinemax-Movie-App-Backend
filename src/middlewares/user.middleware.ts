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

  body("newPassword")
    .isLength({ min: 6, max: 12 })
    .withMessage("Password must be between 6 and 12 characters."),
];

const requireAtLeastOneField = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const {
    fullName,
    email,
    avatar,
    currentPassword,
    newPassword,
    confirmNewPassword,
  } = req.body;

  const isProfileUpdate = fullName || email || avatar;
  const isPasswordUpdate = newPassword && currentPassword && confirmNewPassword;

  if (!isProfileUpdate && !isPasswordUpdate) {
    return res
      .status(400)
      .json({ message: "At least one valid field to change is required!" });
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
