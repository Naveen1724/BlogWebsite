import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { BlogProvider } from "../context/BlogContext";
import BlogList from "./BlogList";
import MyBlogs from "./MyBlogs";
import CreateBlog from "./CreateBlog";
import EditBlog from "./EditBlog";
import BlogView from "./BlogView";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("home");
  const [selectedBlog, setSelectedBlog] = useState(null);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedBlog(null);
  };

  const handleEditBlog = (blog) => {
    setSelectedBlog(blog);
    setActiveTab("edit");
  };

  const handleViewBlog = (blog) => {
    setSelectedBlog(blog);
    setActiveTab("view");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <BlogList onViewBlog={handleViewBlog} />;
      case "my-blogs":
        return (
          <MyBlogs onEditBlog={handleEditBlog} onViewBlog={handleViewBlog} />
        );
      case "create":
        return <CreateBlog onSuccess={() => setActiveTab("my-blogs")} />;
      case "edit":
        return (
          <EditBlog
            blog={selectedBlog}
            onSuccess={() => setActiveTab("my-blogs")}
          />
        );
      case "view":
        return (
          <BlogView blog={selectedBlog} onBack={() => setActiveTab("home")} />
        );
      default:
        return <BlogList onViewBlog={handleViewBlog} />;
    }
  };

  return (
    <BlogProvider>
      <div className="dashboard">
        <header className="dashboard-header">
          <div className="dashboard-container">
            <div className="header-left">
              <h1 className="dashboard-title">
                <span className="gradient-text">BlogSpace</span>
              </h1>
              <p className="dashboard-subtitle">
                Welcome back, {user?.name || user?.username || "User"}!
              </p>
            </div>
            <div className="header-right">
              <button onClick={logout} className="logout-button">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16,17 21,12 16,7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </header>

        <div className="dashboard-help-banner">
          <div className="dashboard-container">
            <div className="help-content">
              <h3>Navigation Guide</h3>
              <p>Use the navigation tabs below to access different sections:</p>
              <ul>
                <li>
                  <strong>All Blogs</strong> - Browse all published blog posts
                </li>
                <li>
                  <strong>My Blogs</strong> - View and manage your personal blog
                  posts
                </li>
                <li>
                  <strong>Create Blog</strong> - Write and publish a new blog
                  post
                </li>
              </ul>
            </div>
          </div>
        </div>

        <nav className="dashboard-nav">
          <div className="dashboard-container">
            <div className="nav-tabs">
              <button
                className={`nav-tab ${activeTab === "home" ? "active" : ""}`}
                onClick={() => handleTabChange("home")}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9,22 9,12 15,12 15,22" />
                </svg>
                All Blogs
              </button>
              <button
                className={`nav-tab ${
                  activeTab === "my-blogs" ? "active" : ""
                }`}
                onClick={() => handleTabChange("my-blogs")}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                </svg>
                My Blogs
                <span className="tab-tooltip">View your posts</span>
              </button>
              <button
                className={`nav-tab ${activeTab === "create" ? "active" : ""}`}
                onClick={() => handleTabChange("create")}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
                Create Blog
                <span className="tab-tooltip">Write a new post</span>
              </button>
            </div>
          </div>
        </nav>

        <main className="dashboard-main">
          <div className="dashboard-container">{renderContent()}</div>
        </main>
      </div>
    </BlogProvider>
  );
};

export default Dashboard;
