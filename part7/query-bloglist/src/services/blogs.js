import axios from "axios";

const baseUrl = "/api/blogs";

let token = null;

export const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

export const getBlogs = async () => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.get(baseUrl, config);
  return response.data;
};

export const createBlog = async (blogObject) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post(baseUrl, blogObject, config);
  return response.data;
};

export const updateBlog = async (id, blogObject) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.put(`${baseUrl}/${id}`, blogObject, config);
  return response.data;
};

export const removeBlog = async (id) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response.data;
};
