const express = require("express");
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
  getMyBlogs,
  toggleLike,
} = require("../controllers/blogController");
const {
  authMiddleware,
  optionalAuthMiddleware,
} = require("../middleware/auth");
const {
  createBlogValidation,
  updateBlogValidation,
} = require("../middleware/validation");

const router = express.Router();

// @route   POST /api/blogs
// @desc    Create a new blog
// @access  Private (authenticated users only)
router.post("/", authMiddleware, createBlogValidation, createBlog);

// @route   GET /api/blogs
// @desc    Get all blogs with pagination and filtering
// @access  Public
router.get("/", getAllBlogs);

// @route   GET /api/blogs/my-blogs
// @desc    Get current user's blogs
// @access  Private
router.get("/my-blogs", authMiddleware, getMyBlogs);

// @route   GET /api/blogs/slug/:slug
// @desc    Get single blog by slug
// @access  Public (but may require auth for private blogs)
router.get("/slug/:slug", optionalAuthMiddleware, getBlogBySlug);

// @route   GET /api/blogs/:id
// @desc    Get single blog by ID
// @access  Public (but may require auth for private blogs)
router.get("/:id", optionalAuthMiddleware, getBlogById);

// @route   PUT /api/blogs/:id
// @desc    Update blog
// @access  Private (owner only)
router.put("/:id", authMiddleware, updateBlogValidation, updateBlog);

// @route   DELETE /api/blogs/:id
// @desc    Delete blog
// @access  Private (owner only)
router.delete("/:id", authMiddleware, deleteBlog);

// @route   POST /api/blogs/:id/like
// @desc    Like/Unlike blog
// @access  Private
router.post("/:id/like", authMiddleware, toggleLike);

module.exports = router;
