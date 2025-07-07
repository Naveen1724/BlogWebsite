const { body } = require("express-validator");

const signupValidation = [
  body("username")
    .isLength({ min: 3, max: 50 })
    .withMessage("Username must be between 3 and 50 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores"),

  body("email")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
];

const loginValidation = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Password is required"),
];

// Blog validation rules
const createBlogValidation = [
  body("title")
    .isLength({ min: 5, max: 200 })
    .withMessage("Title must be between 5 and 200 characters")
    .trim(),

  body("content")
    .isLength({ min: 10 })
    .withMessage("Content must be at least 10 characters long")
    .trim(),

  body("summary")
    .isLength({ min: 10, max: 500 })
    .withMessage("Summary must be between 10 and 500 characters")
    .trim(),

  body("tags").optional().isArray().withMessage("Tags must be an array"),

  body("category")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("Category must be between 2 and 50 characters")
    .trim(),

  body("status")
    .optional()
    .isIn(["draft", "published", "archived"])
    .withMessage("Status must be draft, published, or archived"),

  body("isPublic")
    .optional()
    .isBoolean()
    .withMessage("isPublic must be a boolean value"),

  body("featuredImage")
    .optional()
    .isURL()
    .withMessage("Featured image must be a valid URL"),
];

const updateBlogValidation = [
  body("title")
    .optional()
    .isLength({ min: 5, max: 200 })
    .withMessage("Title must be between 5 and 200 characters")
    .trim(),

  body("content")
    .optional()
    .isLength({ min: 10 })
    .withMessage("Content must be at least 10 characters long")
    .trim(),

  body("summary")
    .optional()
    .isLength({ min: 10, max: 500 })
    .withMessage("Summary must be between 10 and 500 characters")
    .trim(),

  body("tags").optional().isArray().withMessage("Tags must be an array"),

  body("category")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("Category must be between 2 and 50 characters")
    .trim(),

  body("status")
    .optional()
    .isIn(["draft", "published", "archived"])
    .withMessage("Status must be draft, published, or archived"),

  body("isPublic")
    .optional()
    .isBoolean()
    .withMessage("isPublic must be a boolean value"),

  body("featuredImage")
    .optional()
    .isURL()
    .withMessage("Featured image must be a valid URL"),
];

module.exports = {
  signupValidation,
  loginValidation,
  createBlogValidation,
  updateBlogValidation,
};
