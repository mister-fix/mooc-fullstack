import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import {
  createBlog,
  deleteBlog,
  initializeBlogs,
  likeBlog,
  resetBlogs,
} from './reducers/blogsReducer';
import { setNotification } from './reducers/notificationReducer';
import { clearUser, setUser } from './reducers/userReducer';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => {
    const sortedBlogs = [...state.blogs].sort((a, b) => b.likes - a.likes);
    return sortedBlogs;
  });
  const user = useSelector((state) => state.user?.user || null);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON); // Fixing JSON.parse here
      blogService.setToken(user.token);
      dispatch(setUser(user)); // Set user in the Redux store

      // verifying token validity by attempting to retrieve blogs
      dispatch(initializeBlogs());
    }
  }, [dispatch]);

  const handleLogin = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user));
      blogService.setToken(user.token);
      dispatch(setUser(user)); // Update the Redux store
      dispatch(initializeBlogs()); // Fetch blogs after login
    } catch (error) {
      dispatch(setNotification('Wrong username or password', 5));
    }
  };

  const blogFormRef = useRef();

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility();

      const existingBlog = blogs.find(
        (blog) => blog.title === blogObject.title,
      );

      if (existingBlog) {
        dispatch(
          setNotification(
            `Blog with title "${blogObject.title}" already exists`,
          ),
        );
        return;
      }

      const blogToCreate = {
        ...blogObject,
        user: { username: user.username, name: user.name, id: user.id }, // Add user details here
      };

      dispatch(createBlog(blogToCreate));
      dispatch(
        setNotification(
          `A new blog "${blogToCreate.title}" by ${blogToCreate.author} added`,
          5,
        ),
      );
    } catch (error) {
      console.error('Error creating blog:', error);
      dispatch(setNotification('Error creating blog', 5));
    }
  };

  const handleLike = async (event, id) => {
    event.preventDefault();

    const blog = blogs.find((b) => b.id === id);
    const updatedBlog = { ...blog, likes: blog.likes + 1 };
    dispatch(likeBlog(id, updatedBlog));
  };

  const handleDelete = async (event, id) => {
    event.preventDefault();

    const blog = blogs.find((b) => b.id === id);
    const accept = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}`,
    );

    if (accept) {
      dispatch(deleteBlog(blog.id));
      dispatch(
        setNotification(
          `Blog '${blog.title} by ${blog.author}' has been removed from the server`,
          5,
        ),
      );
    } else {
      dispatch(
        setNotification(
          `Blog ${blog.title} has already been removed from the server`,
          5,
        ),
      );
    }
  };

  const handleLogout = () => {
    dispatch(resetBlogs()); // Clear blogs
    dispatch(clearUser()); // Clear user from Redux store
    window.localStorage.removeItem('loggedBlogAppUser');
    blogService.setToken(null);
  };

  const loginView = () => (
    <div>
      <h2>log in to application</h2>

      <Notification />

      <form onSubmit={handleLogin}>
        <div>
          username: <input type="text" name="username" />
        </div>
        <div>
          password: <input type="password" name="password" />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );

  const blogView = () => (
    <div>
      <div>
        <h2>blogs</h2>

        <Notification />

        <p>
          {user.name} logged in <button onClick={handleLogout}>logout</button>
        </p>
      </div>

      <Togglable buttonLabel={'add blog'} ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            handleLike={handleLike}
            handleDelete={handleDelete}
          />
        ))}
    </div>
  );

  return <div>{user === null ? loginView() : blogView()}</div>;
};

export default App;
