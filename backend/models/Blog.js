const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters long"],
      maxlength: [200, "Title must not exceed 200 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      minlength: [10, "Content must be at least 10 characters long"],
    },
    summary: {
      type: String,
      required: [true, "Summary is required"],
      trim: true,
      maxlength: [500, "Summary must not exceed 500 characters"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    category: {
      type: String,
      trim: true,
      lowercase: true,
      default: "general",
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
    },
    readTime: {
      type: Number, // in minutes
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    featuredImage: {
      type: String,
      default: null,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate slug from title before saving
blogSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 50);

    // Add timestamp to ensure uniqueness
    this.slug += "-" + Date.now();
  }

  // Calculate read time (average 200 words per minute)
  if (this.isModified("content")) {
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / 200);
  }

  next();
});

// Virtual for like count
blogSchema.virtual("likeCount").get(function () {
  return this.likes.length;
});

// Ensure virtual fields are serialized
blogSchema.set("toJSON", { virtuals: true });
blogSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Blog", blogSchema);
