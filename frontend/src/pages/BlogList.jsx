import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBlog } from "../context/BlogContext";
import { useAuth } from "../context/AuthContext";
import "../styles/BlogList.css";

const BlogList = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    blogs,
    isLoading,
    error,
    pagination,
    getAllBlogs,
    toggleLike,
    setFilters,
    clearError,
  } = useBlog();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    getAllBlogs();
  }, [getAllBlogs]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ search: searchTerm, category: selectedCategory });
    getAllBlogs({ search: searchTerm, category: selectedCategory });
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setFilters({ search: "", category: "" });
    getAllBlogs({ search: "", category: "" });
  };

  const handleLike = async (blogId) => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    await toggleLike(blogId);
  };

  const handleViewBlog = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const categories = [
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

  if (isLoading && blogs.length === 0) {
    return (
      <div className="blog-list-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-list">
      <div className="blog-list-header">
        <h2 className="blog-list-title">Discover Amazing Blogs</h2>
        <p className="blog-list-subtitle">
          Explore the latest articles from our community
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

      <div className="blog-filters">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <span className="search-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
          <button type="submit" className="search-button">
            Search
          </button>
          {(searchTerm || selectedCategory) && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="clear-button"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {blogs.length === 0 ? (
        <div className="empty-state">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14,2 14,8 20,8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10,9 9,9 8,9" />
          </svg>
          <h3>No blogs found</h3>
          <p>
            Try adjusting your search criteria or check back later for new
            content.
          </p>
        </div>
      ) : (
        <div className="blog-grid">
          {blogs.map((blog) => (
            <article key={blog.id} className="blog-card" onClick={() => handleViewBlog(blog.id)}>
              {blog.featuredImage && (
                <div className="blog-card-image">
                  <img src={blog.featuredImage} alt={blog.title} />
                </div>
              )}
              <div className="blog-card-content">
                <div className="blog-card-header">
                  <span className="blog-category">{blog.category}</span>
                  <span className="blog-read-time">
                    {blog.readTime} min read
                  </span>
                </div>
                <h3
                  className="blog-card-title"
                >
                  {blog.title}
                </h3>
                <p className="blog-card-summary">{blog.summary}</p>
                <div className="blog-card-tags">
                  {blog.tags?.slice(0, 3).map((tag, index) => (
                    <span key={index} className="blog-tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="blog-card-footer">
                  <div className="blog-author">
                    <div className="author-avatar">
                      {blog.author?.username?.charAt(0).toUpperCase() || "A"}
                    </div>
                    <div className="author-info">
                      <span className="author-name">
                        {blog.author?.username || "Anonymous"}
                      </span>
                      <span className="blog-date">
                        {formatDate(blog.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="blog-actions">
                    <button
                      onClick={() => handleLike(blog.id)}
                      className={`like-button ${blog.isLiked ? "liked" : ""}`}
                      type="button"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        style={{ marginRight: "5px", verticalAlign: "middle" }}
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                      <span className="like-count">{blog.likeCount || 0}</span>
                    </button>
                    <span className="view-count">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        style={{ marginRight: "5px", verticalAlign: "middle" }}
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      <span className="views">{blog.views || 0}</span>
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {pagination && pagination.pages > 1 && (
        <div className="pagination">
          <button
            onClick={() => getAllBlogs({ page: pagination.page - 1 })}
            disabled={pagination.page === 1}
            className="pagination-button"
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => getAllBlogs({ page: pagination.page + 1 })}
            disabled={pagination.page === pagination.pages}
            className="pagination-button"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogList;
