import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBlog } from "../context/BlogContext";
import { useAuth } from "../context/AuthContext";
import "../styles/BlogView.css";

const BlogView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getBlog, toggleLike, deleteBlog } = useBlog();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiking, setIsLiking] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await getBlog(id);
        setBlog(response.blog);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, getBlog]);

  const handleLike = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    try {
      setIsLiking(true);
      const response = await toggleLike(id);
      if (response.success) {
        setBlog((prev) => ({
          ...prev,
          likeCount: response.likeCount,
          isLiked: response.isLiked,
        }));
      }
    } catch (err) {
      console.error("Failed to like blog:", err);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBlog(id);
      navigate("/my-blogs");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete blog");
    }
  };

  const handleEdit = () => {
    navigate(`/edit-blog/${id}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.split(" ").length;
    const readTime = Math.ceil(words / wordsPerMinute);
    return readTime;
  };

  if (loading) {
    return (
      <div className="blog-view-container">
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-view-container">
        <div className="error-container">
          <div className="error-icon">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <h2>Error Loading Blog</h2>
          <p>{error}</p>
          <button onClick={() => navigate("/blogs")} className="back-button">
            Go Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="blog-view-container">
        <div className="error-container">
          <h2>Blog Not Found</h2>
          <p>The blog you're looking for doesn't exist.</p>
          <button onClick={() => navigate("/blogs")} className="back-button">
            Go Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  const isOwner = user && blog.author.id === user.id;

  return (
    <div className="blog-view-container">
      <div className="blog-view-header">
        <button onClick={() => navigate("/blogs")} className="back-button">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Blogs
        </button>

        {isOwner && (
          <div className="blog-actions">
            <button onClick={handleEdit} className="edit-button">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="delete-button"
            >
              <svg
                width="18"
                height="18"
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
        )}
      </div>

      <article className="blog-article">
        {blog.featuredImage && (
          <div className="blog-featured-image">
            <img src={blog.featuredImage} alt={blog.title} />
          </div>
        )}

        <header className="blog-header">
          <div className="blog-meta">
            <span className="blog-category">{blog.category}</span>
            <span className="blog-date">{formatDate(blog.createdAt)}</span>
            <span className="blog-read-time">
              {calculateReadTime(blog.content)} min read
            </span>
          </div>

          <h1 className="blog-title">{blog.title}</h1>

          <div className="blog-author">
            <div className="author-avatar">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="author-info">
              <span className="author-name">{blog.author.username}</span>
              <span className="author-email">{blog.author.email}</span>
            </div>
          </div>
        </header>

        <div className="blog-content">
          {blog.summary && (
            <div className="blog-summary">
              <h3>Summary</h3>
              <p>{blog.summary}</p>
            </div>
          )}

          <div className="blog-body">
            {blog.content.split("\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        <footer className="blog-footer">
          {blog.tags && blog.tags.length > 0 && (
            <div className="blog-tags">
              {blog.tags.map((tag, index) => (
                <span key={index} className="blog-tag">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="blog-stats">
            <span className="stat-item">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ marginRight: "4px", verticalAlign: "middle" }}
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span>{blog.views || 0} views</span>
            </span>
            <button
              onClick={handleLike}
              className={`like-button ${blog.isLiked ? "liked" : ""}`}
              disabled={isLiking || !user}
              type="button"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill={blog.isLiked ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                style={{ marginRight: "4px", verticalAlign: "middle" }}
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span>{blog.likeCount || 0}</span>
            </button>
          </div>
        </footer>
      </article>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Delete Blog</h3>
            <p>
              Are you sure you want to delete this blog? This action cannot be
              undone.
            </p>
            <div className="modal-actions">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="cancel-button"
              >
                Cancel
              </button>
              <button onClick={handleDelete} className="confirm-delete-button">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogView;
