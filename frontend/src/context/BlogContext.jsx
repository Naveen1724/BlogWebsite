import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import { blogAPI } from "../utils/api";

// Initial state
const initialState = {
  blogs: [],
  myBlogs: [],
  currentBlog: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  filters: {
    category: "",
    search: "",
    status: "published",
    sortBy: "createdAt",
    sortOrder: "desc",
  },
};

// Action types
const BLOG_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_BLOGS: "SET_BLOGS",
  SET_MY_BLOGS: "SET_MY_BLOGS",
  SET_CURRENT_BLOG: "SET_CURRENT_BLOG",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
  SET_PAGINATION: "SET_PAGINATION",
  SET_FILTERS: "SET_FILTERS",
  ADD_BLOG: "ADD_BLOG",
  UPDATE_BLOG: "UPDATE_BLOG",
  DELETE_BLOG: "DELETE_BLOG",
  TOGGLE_LIKE: "TOGGLE_LIKE",
};

// Reducer
const blogReducer = (state, action) => {
  switch (action.type) {
    case BLOG_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case BLOG_ACTIONS.SET_BLOGS:
      return {
        ...state,
        blogs: action.payload,
        isLoading: false,
        error: null,
      };
    case BLOG_ACTIONS.SET_MY_BLOGS:
      return {
        ...state,
        myBlogs: action.payload,
        isLoading: false,
        error: null,
      };
    case BLOG_ACTIONS.SET_CURRENT_BLOG:
      return {
        ...state,
        currentBlog: action.payload,
        isLoading: false,
        error: null,
      };
    case BLOG_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case BLOG_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    case BLOG_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: action.payload,
      };
    case BLOG_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };
    case BLOG_ACTIONS.ADD_BLOG:
      return {
        ...state,
        myBlogs: [action.payload, ...state.myBlogs],
        blogs: [action.payload, ...state.blogs],
      };
    case BLOG_ACTIONS.UPDATE_BLOG:
      return {
        ...state,
        blogs: state.blogs.map((blog) =>
          blog.id === action.payload.id ? action.payload : blog
        ),
        myBlogs: state.myBlogs.map((blog) =>
          blog.id === action.payload.id ? action.payload : blog
        ),
        currentBlog:
          state.currentBlog?.id === action.payload.id
            ? action.payload
            : state.currentBlog,
      };
    case BLOG_ACTIONS.DELETE_BLOG:
      return {
        ...state,
        blogs: state.blogs.filter((blog) => blog.id !== action.payload),
        myBlogs: state.myBlogs.filter((blog) => blog.id !== action.payload),
        currentBlog:
          state.currentBlog?.id === action.payload ? null : state.currentBlog,
      };
    case BLOG_ACTIONS.TOGGLE_LIKE: {
      const { blogId, isLiked, likeCount } = action.payload;
      return {
        ...state,
        blogs: state.blogs.map((blog) =>
          blog.id === blogId ? { ...blog, isLiked, likeCount } : blog
        ),
        currentBlog:
          state.currentBlog?.id === blogId
            ? { ...state.currentBlog, isLiked, likeCount }
            : state.currentBlog,
      };
    }
    default:
      return state;
  }
};

// Create context
const BlogContext = createContext();

// Blog provider component
export const BlogProvider = ({ children }) => {
  const [state, dispatch] = useReducer(blogReducer, initialState);

  // Get all blogs
  const getAllBlogs = useCallback(
    async (params = {}) => {
      try {
        dispatch({ type: BLOG_ACTIONS.SET_LOADING, payload: true });
        const queryParams = { ...state.filters, ...params };
        const response = await blogAPI.getAllBlogs(queryParams);
        dispatch({
          type: BLOG_ACTIONS.SET_BLOGS,
          payload: response.data.data.blogs,
        });
        dispatch({
          type: BLOG_ACTIONS.SET_PAGINATION,
          payload: response.data.data.pagination,
        });
        return { success: true };
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Failed to fetch blogs";
        dispatch({ type: BLOG_ACTIONS.SET_ERROR, payload: errorMessage });
        return { success: false, error: errorMessage };
      }
    },
    [state.filters]
  );

  // Get user's blogs
  const getMyBlogs = useCallback(async (params = {}) => {
    try {
      dispatch({ type: BLOG_ACTIONS.SET_LOADING, payload: true });
      const response = await blogAPI.getMyBlogs(params);
      dispatch({
        type: BLOG_ACTIONS.SET_MY_BLOGS,
        payload: response.data.data.blogs,
      });
      dispatch({
        type: BLOG_ACTIONS.SET_PAGINATION,
        payload: response.data.data.pagination,
      });
      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch your blogs";
      dispatch({ type: BLOG_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, []);

  // Get single blog
  const getBlog = useCallback(async (id) => {
    try {
      dispatch({ type: BLOG_ACTIONS.SET_LOADING, payload: true });
      const response = await blogAPI.getBlog(id);
      dispatch({
        type: BLOG_ACTIONS.SET_CURRENT_BLOG,
        payload: response.data.data.blog,
      });
      return { success: true, blog: response.data.data.blog };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch blog";
      dispatch({ type: BLOG_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, []);

  // Create blog
  const createBlog = useCallback(async (blogData) => {
    try {
      dispatch({ type: BLOG_ACTIONS.SET_LOADING, payload: true });
      const response = await blogAPI.createBlog(blogData);
      dispatch({
        type: BLOG_ACTIONS.ADD_BLOG,
        payload: response.data.data.blog,
      });
      return { success: true, blog: response.data.data.blog };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to create blog";
      dispatch({ type: BLOG_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, []);

  // Update blog
  const updateBlog = useCallback(async (id, blogData) => {
    try {
      dispatch({ type: BLOG_ACTIONS.SET_LOADING, payload: true });
      const response = await blogAPI.updateBlog(id, blogData);
      dispatch({
        type: BLOG_ACTIONS.UPDATE_BLOG,
        payload: response.data.data.blog,
      });
      return { success: true, blog: response.data.data.blog };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update blog";
      dispatch({ type: BLOG_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, []);

  // Delete blog
  const deleteBlog = useCallback(async (id) => {
    try {
      dispatch({ type: BLOG_ACTIONS.SET_LOADING, payload: true });
      await blogAPI.deleteBlog(id);
      dispatch({ type: BLOG_ACTIONS.DELETE_BLOG, payload: id });
      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete blog";
      dispatch({ type: BLOG_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, []);

  // Toggle like
  const toggleLike = useCallback(async (id) => {
    try {
      const response = await blogAPI.toggleLike(id);
      dispatch({
        type: BLOG_ACTIONS.TOGGLE_LIKE,
        payload: {
          blogId: id,
          isLiked: response.data.data.isLiked,
          likeCount: response.data.data.likeCount,
        },
      });
      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to toggle like";
      dispatch({ type: BLOG_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, []);

  // Set filters
  const setFilters = useCallback((filters) => {
    dispatch({ type: BLOG_ACTIONS.SET_FILTERS, payload: filters });
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: BLOG_ACTIONS.CLEAR_ERROR });
  }, []);

  const value = {
    ...state,
    getAllBlogs,
    getMyBlogs,
    getBlog,
    createBlog,
    updateBlog,
    deleteBlog,
    toggleLike,
    setFilters,
    clearError,
  };

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
};

// Custom hook to use blog context
export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error("useBlog must be used within a BlogProvider");
  }
  return context;
};
