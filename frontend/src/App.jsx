import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { BlogProvider } from "./context/BlogContext";
import AuthPage from "./pages/AuthPage";
import BlogList from "./pages/BlogList";
import BlogView from "./pages/BlogView";
import CreateBlog from "./pages/CreateBlog";
import EditBlog from "./pages/EditBlog";
import MyBlogs from "./pages/MyBlogs";
import MainLayout from "./components/MainLayout";
import "./App.css";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          {/* <p>Loading...</p> */}
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/auth" replace />;
};

// Public Route Component (redirects to main blogs page if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          {/* <p>Loading...</p> */}
        </div>
      </div>
    );
  }

  return !isAuthenticated ? children : <Navigate to="/blogs" replace />;
};

// Main App Component
const App = () => {
  return (
    <AuthProvider>
      <BlogProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/auth"
              element={
                <PublicRoute>
                  <AuthPage />
                </PublicRoute>
              }

              
            />
            {/* Main Layout Routes */}
            <Route element={<MainLayout />}>
              {/* Public Routes */}
              <Route path="/blogs" element={<BlogList />} />
              <Route path="/blog/:id" element={<BlogView />} />

              {/* Protected Routes */}
              <Route
                path="/my-blogs"
                element={
                  <ProtectedRoute>
                    <MyBlogs />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/create-blog"
                element={
                  <ProtectedRoute>
                    <CreateBlog />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/edit-blog/:id"
                element={
                  <ProtectedRoute>
                    <EditBlog />
                  </ProtectedRoute>
                }
              />

              {/* Default redirect */}
              <Route index element={<Navigate to="/blogs" replace />} />
            </Route>{" "}
            {/* Legacy redirects */}
            <Route
              path="/dashboard/*"
              element={<Navigate to="/blogs" replace />}
            />
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/blogs" replace />} />
          </Routes>
        </Router>
      </BlogProvider>
    </AuthProvider>
  );
};

export default App;
