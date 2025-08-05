const Blog = require("../models/Blog");
const User = require("../models/User");
const { validationResult } = require("express-validator");

// @desc    Create new blog
// @route   POST /api/blogs
// @access  Private (authenticated users only)
const createBlog = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const {
      title,
      content,
      summary,
      tags,
      category,
      status,
      featuredImage,
      isPublic,
    } = req.body;

    // Create new blog with author as current user
    const blog = new Blog({
      title,
      content,
      summary,
      tags: tags || [],
      category: category || "general",
      status: status || "published",
      featuredImage,
      isPublic: isPublic !== undefined ? isPublic : true,
      author: req.user.userId,
    });

    await blog.save();

    // Populate author details
    await blog.populate("author", "username email");

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: { blog },
    });
  } catch (error) {
    console.error("Create blog error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Get all blogs (public)
// @route   GET /api/blogs
// @access  Public
const getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const category = req.query.category;
    const status = req.query.status || "published";
    const search = req.query.search;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    // Build filter query
    let filter = { isPublic: true, status: status };

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { summary: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    // Get blogs with pagination
    const blogs = await Blog.find(filter)
      .populate("author", "username email")
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .select("-content"); // Exclude full content for list view

    // Get total count for pagination
    const total = await Blog.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        blogs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get blogs error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Get single blog by ID
// @route   GET /api/blogs/:id
// @access  Public
const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "author",
      "username email"
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Check if blog is public or if user is the author
    if (
      !blog.isPublic &&
      (!req.user || req.user.userId !== blog.author._id.toString())
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied. This blog is private.",
      });
    }

    // Increment view count
    blog.views += 1;
    await blog.save();

    res.status(200).json({
      success: true,
      data: { blog },
    });
  } catch (error) {
    console.error("Get blog error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Get single blog by slug
// @route   GET /api/blogs/slug/:slug
// @access  Public
const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug }).populate(
      "author",
      "username email"
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Check if blog is public or if user is the author
    if (
      !blog.isPublic &&
      (!req.user || req.user.userId !== blog.author._id.toString())
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied. This blog is private.",
      });
    }

    // Increment view count
    blog.views += 1;
    await blog.save();

    res.status(200).json({
      success: true,
      data: { blog },
    });
  } catch (error) {
    console.error("Get blog by slug error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private (owner only)
const updateBlog = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Check if user is the owner
    if (blog.author.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only update your own blogs.",
      });
    }

    const {
      title,
      content,
      summary,
      tags,
      category,
      status,
      featuredImage,
      isPublic,
    } = req.body;

    // Update fields
    if (title) blog.title = title;
    if (content) blog.content = content;
    if (summary) blog.summary = summary;
    if (tags) blog.tags = tags;
    if (category) blog.category = category;
    if (status) blog.status = status;
    if (featuredImage !== undefined) blog.featuredImage = featuredImage;
    if (isPublic !== undefined) blog.isPublic = isPublic;

    await blog.save();
    await blog.populate("author", "username email");

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: { blog },
    });
  } catch (error) {
    console.error("Update blog error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private (owner only)
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Check if user is the owner
    if (blog.author.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only delete your own blogs.",
      });
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Delete blog error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Get user's own blogs
// @route   GET /api/blogs/my-blogs
// @access  Private
const getMyBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const status = req.query.status;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    // Build filter query
    let filter = { author: req.user.userId };

    if (status) {
      filter.status = status;
    }

    // Get user's blogs with pagination
    const blogs = await Blog.find(filter)
      .populate("author", "username email")
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Blog.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        blogs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get my blogs error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Like/Unlike blog
// @route   POST /api/blogs/:id/like
// @access  Private
const toggleLike = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const userId = req.user.userId;
    const likeIndex = blog.likes.indexOf(userId);

    if (likeIndex === -1) {
      // Add like
      blog.likes.push(userId);
    } else {
      // Remove like
      blog.likes.splice(likeIndex, 1);
    }

    await blog.save();

    res.status(200).json({
      success: true,
      message: likeIndex === -1 ? "Blog liked" : "Blog unliked",
      data: {
        likeCount: blog.likes.length,
        isLiked: likeIndex === -1,
      },
    });
  } catch (error) {
    console.error("Toggle like error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
  getMyBlogs,
  toggleLike,
};
