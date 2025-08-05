import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBlog } from "../context/BlogContext";
import "../styles/MyBlogs.css";

const MyBlogs = () => {
  const navigate = useNavigate();
  const { myBlogs, isLoading, error, getMyBlogs, deleteBlog, clearError } =
    useBlog();

  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    getMyBlogs();
  }, [getMyBlogs]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleDelete = async (blogId) => {
    const result = await deleteBlog(blogId);
    if (result.success) {
      setDeleteConfirm(null);
    }
  };

  const handleEditBlog = (blogId) => {
    navigate(`/edit-blog/${blogId}`);
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

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "status-published";
      case "draft":
        return "status-draft";
      case "archived":
        return "status-archived";
      default:
        return "status-draft";
    }
  };

  if (isLoading && myBlogs.length === 0) {
    return (
      <div className="my-blogs-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-blogs">
      <div className="my-blogs-header">
        <h2 className="my-blogs-title">My Blog Posts</h2>
        <p className="my-blogs-subtitle">Manage and edit your blog posts</p>
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

      {myBlogs.length === 0 ? (
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
          <h3>No blog posts yet</h3>
          <p>
            Start creating your first blog post to share your thoughts with the
            world!
          </p>
        </div>
      ) : (
        <div className="my-blogs-grid">
          {myBlogs.map((blog) => (
            <article key={blog.id} className="my-blog-card">
              {blog.featuredImage && (
                <div className="my-blog-card-image">
                  <img src={blog.featuredImage} alt={blog.title} />
                </div>
              )}
              <div className="my-blog-card-content">
                <div className="my-blog-card-header">
                  <span
                    className={`blog-status ${getStatusColor(blog.status)}`}
                  >
                    {blog.status}
                  </span>
                  <span className="blog-category">{blog.category}</span>
                </div>
                <h3
                  className="my-blog-card-title"
                  onClick={() => handleViewBlog(blog.id)}
                >
                  {blog.title}
                </h3>
                <p className="my-blog-card-summary">{blog.summary}</p>
                <div className="my-blog-card-stats">
                  <span className="stat">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    <span>{blog.views || 0} views</span>
                  </span>
                  <span className="stat">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    <span>{blog.likeCount || 0} likes</span>
                  </span>
                  <span className="stat">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12,6 12,12 16,14" />
                    </svg>
                    <span>{blog.readTime} min read</span>
                  </span>
                </div>
                <div className="my-blog-card-footer">
                  <span className="blog-date">
                    Created {formatDate(blog.createdAt)}
                  </span>
                  <div className="blog-actions">
                    <button
                      onClick={() => handleEditBlog(blog.id)}
                      className="action-button edit-button"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(blog.id)}
                      className="action-button delete-button"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="3,6 5,6 21,6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {deleteConfirm && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <div className="delete-modal-header">
              <h3>Delete Blog Post</h3>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="close-button"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="delete-modal-content">
              <p>
                Are you sure you want to delete this blog post? This action
                cannot be undone.
              </p>
            </div>
            <div className="delete-modal-actions">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="cancel-button"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="confirm-delete-button"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBlogs;
