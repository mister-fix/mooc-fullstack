import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import {
  createBlog,
  initializeBlogs,
  resetBlogs,
} from './reducers/blogsReducer';
import { setNotification } from './reducers/notificationReducer';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const dispatch = useDispatch();
  // const [blogs, setBlogs] = useState([]);
  const blogs = useSelector((state) => {
    const blogs = state.blogs;
    const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);

    return sortedBlogs;
  });
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON); // Fixing JSON.parse here
      blogService.setToken(user.token);

      // verifying token validity by attempting to retrieve blogs
      dispatch(initializeBlogs());
      setUser(user);
    }
  }, [dispatch]);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user));
      blogService.setToken(user.token);

      setUser(user);
      setUsername('');
      setPassword('');

      await dispatch(initializeBlogs);
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
  };

  const handleDelete = async (event, id) => {
    event.preventDefault();

    const blog = blogs.find((b) => b.id === id);
    const accept = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}`,
    );

    // if (accept) {
    //   await blogService.remove(id).then(() => {
    //     setBlogs(blogs.filter((blog) => blog.id !== id));
    //     dispatch(
    //       setNotification(
    //         `Blog '${blog.title} by ${blog.author}' has been removed from the server`,
    //         5,
    //       ),
    //     );
    //   });
    // } else {
    //   dispatch(
    //     setNotification(
    //       `Blog ${blog.title} has already been removed from the server`,
    //       5,
    //     ),
    //   );
    // }
  };

  const handleLogout = () => {
    console.log('logged out');
    window.localStorage.removeItem('loggedBlogAppUser');
    blogService.setToken(null);
    setUser(null);
    dispatch(resetBlogs()); // Clear blogs on logout
  };

  const loginView = () => (
    <div>
      <h2>log in to application</h2>

      <Notification />

      <form onSubmit={handleLogin}>
        <div>
          username:{' '}
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password:{' '}
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
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
