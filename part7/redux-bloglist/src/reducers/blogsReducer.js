import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogs';

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },
    appendBlog(state, action) {
      state.push(action.payload);
    },
    resetBlog(state, action) {
      return [];
    },
    removeBlog(state, action) {
      return state.filter((blog) => blog.id !== action.payload);
    },
  },
});

export const { setBlogs, appendBlog, removeBlog, resetBlog } =
  blogSlice.actions;

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    console.log('Fetched blogs:', blogs);
    await dispatch(setBlogs(blogs));
  };
};

export const createBlog = (content) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(content); // Create the blog via the service
    dispatch(appendBlog(newBlog)); // Append the newly created blog to the Redux store
  };
};

export const resetBlogs = () => {
  return async (dispatch) => {
    await dispatch(resetBlog());
  };
};

export const likeBlog = (id, targetBlog) => {
  return async (dispatch, getState) => {
    try {
      // Get the updated blog from the backend after voting
      const updatedBlog = await blogService.update(id, targetBlog);
      // Get the current blogs state
      const blogs = getState().blogs;
      // Create a new array with the updated blogs
      const updatedBlogs = blogs.map((blog) =>
        blog.id !== id ? blog : updatedBlog,
      );

      // Dispatch an action to update the blogs state
      dispatch(setBlogs(updatedBlogs));
    } catch (error) {
      console.error('Error liking blog:', error);
    }
  };
};

export const deleteBlog = (id) => {
  return async (dispatch) => {
    try {
      await blogService.remove(id);
      dispatch(removeBlog(id));
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };
};

export default blogSlice.reducer;
