import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookie-based auth
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth API calls
export const authAPI = {
  // Sign up a new user
  signup: (userData) => api.post("/api/auth/signup", userData),

  // Login user
  login: (credentials) => api.post("/api/auth/login", credentials),

  // Logout user
  logout: () => api.post("/api/auth/logout"),

  // Get current user profile
  getProfile: () => api.get("/api/auth/profile"),
};

// Blog API calls
export const blogAPI = {
  // Get all blogs (with query parameters)
  getAllBlogs: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key]) {
        searchParams.append(key, params[key]);
      }
    });
    const queryString = searchParams.toString();
    return api.get(`/api/blogs${queryString ? `?${queryString}` : ""}`);
  },

  // Get a single blog by ID
  getBlog: (id) => api.get(`/api/blogs/${id}`),

  // Get a single blog by slug
  getBlogBySlug: (slug) => api.get(`/api/blogs/slug/${slug}`),

  // Create a new blog
  createBlog: (blogData) => api.post("/api/blogs", blogData),

  // Update a blog
  updateBlog: (id, blogData) => api.put(`/api/blogs/${id}`, blogData),

  // Delete a blog
  deleteBlog: (id) => api.delete(`/api/blogs/${id}`),

  // Get current user's blogs
  getMyBlogs: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key]) {
        searchParams.append(key, params[key]);
      }
    });
    const queryString = searchParams.toString();
    return api.get(
      `/api/blogs/my-blogs${queryString ? `?${queryString}` : ""}`
    );
  },

  // Like/unlike a blog
  toggleLike: (id) => api.post(`/api/blogs/${id}/like`),
};

export default api;
