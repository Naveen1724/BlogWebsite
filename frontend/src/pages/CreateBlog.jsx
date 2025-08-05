import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBlog } from "../context/BlogContext";
import "../styles/CreateBlog.css";

const CreateBlog = () => {
  const navigate = useNavigate();
  const { createBlog, isLoading, error, clearError } = useBlog();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    summary: "",
    category: "general",
    tags: "",
    featuredImage: "",
    status: "draft",
    isPublic: true,
  });

  const [validationErrors, setValidationErrors] = useState({});

  const categories = [
    "general",
    "technology",
    "programming",
    "design",
    "lifestyle",
    "business",
    "health",
    "travel",
    "food",
    "entertainment",
    "sports",
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required";
    } else if (formData.title.length < 5) {
      errors.title = "Title must be at least 5 characters long";
    } else if (formData.title.length > 200) {
      errors.title = "Title must be less than 200 characters";
    }

    if (!formData.content.trim()) {
      errors.content = "Content is required";
    } else if (formData.content.length < 10) {
      errors.content = "Content must be at least 10 characters long";
    }

    if (!formData.summary.trim()) {
      errors.summary = "Summary is required";
    } else if (formData.summary.length < 10) {
      errors.summary = "Summary must be at least 10 characters long";
    } else if (formData.summary.length > 500) {
      errors.summary = "Summary must be less than 500 characters";
    }

    if (formData.featuredImage && !isValidUrl(formData.featuredImage)) {
      errors.featuredImage = "Please enter a valid image URL";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) {
      return;
    }

    const blogData = {
      ...formData,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
    };

    const result = await createBlog(blogData);

    if (result.success) {
      navigate("/my-blogs");
    }
  };

  return (
    <div className="create-blog">
      <div className="create-blog-header">
        <h2 className="create-blog-title">Create New Blog Post</h2>
        <p className="create-blog-subtitle">
          Share your thoughts and ideas with the world
        </p>
      </div>

      {error && (
        <div className="error-alert">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="create-blog-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`form-input ${validationErrors.title ? "error" : ""}`}
              placeholder="Enter an engaging title for your blog post"
              disabled={isLoading}
            />
            {validationErrors.title && (
              <span className="error-message">{validationErrors.title}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="summary" className="form-label">
              Summary *
            </label>
            <textarea
              id="summary"
              name="summary"
              value={formData.summary}
              onChange={handleInputChange}
              className={`form-textarea ${
                validationErrors.summary ? "error" : ""
              }`}
              placeholder="Write a brief summary of your blog post (10-500 characters)"
              rows="3"
              disabled={isLoading}
            />
            <div className="character-count">{formData.summary.length}/500</div>
            {validationErrors.summary && (
              <span className="error-message">{validationErrors.summary}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="content" className="form-label">
              Content *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              className={`form-textarea content-textarea ${
                validationErrors.content ? "error" : ""
              }`}
              placeholder="Write your blog post content here..."
              rows="15"
              disabled={isLoading}
            />
            {validationErrors.content && (
              <span className="error-message">{validationErrors.content}</span>
            )}
          </div>
        </div>

        <div className="form-row double">
          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="form-select"
              disabled={isLoading}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="form-select"
              disabled={isLoading}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="tags" className="form-label">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter tags separated by commas (e.g., javascript, tutorial, web development)"
              disabled={isLoading}
            />
            <div className="form-hint">
              Use commas to separate multiple tags
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="featuredImage" className="form-label">
              Featured Image URL
            </label>
            <input
              type="url"
              id="featuredImage"
              name="featuredImage"
              value={formData.featuredImage}
              onChange={handleInputChange}
              className={`form-input ${
                validationErrors.featuredImage ? "error" : ""
              }`}
              placeholder="https://example.com/image.jpg"
              disabled={isLoading}
            />
            {validationErrors.featuredImage && (
              <span className="error-message">
                {validationErrors.featuredImage}
              </span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <span className="checkbox-text">Make this blog post public</span>
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <span>Creating...</span>
              </div>
            ) : (
              <>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17,21 17,13 7,13 7,21" />
                  <polyline points="7,3 7,8 15,8" />
                </svg>
                Create Blog Post
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlog;
