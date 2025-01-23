import { useEffect, useRef, useState } from "react";
import Notification from "./components/Notification";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import loginService from "./services/login";
import "./app.css";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState("");
  const blogFormRef = useRef();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON); // Fixing JSON.parse here
      blogService.setToken(user.token);

      // verifying token validity by attempting to retrieve blogs
      blogService
        .getAll()
        .then((blogs) => {
          setUser(user);
          setBlogs(blogs);
        })
        .catch((error) => {
          console.log("Invalid or expired token", error);
          handleLogout();
        });
    }
  }, []);

  const triggerNotification = (message, duration) => {
    setNotification(message);

    const timer = setTimeout(() => {
      setNotification("");
    }, duration * 1000);

    return () => clearTimeout(timer);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      blogService.setToken(user.token);

      setUser(user);
      setUsername("");
      setPassword("");

      await blogService.getAll().then((blogs) => setBlogs(blogs));
      triggerNotification(`Welcome back, ${user.name}!`, 5);
    } catch (err) {
      console.error("Error logging in:", err);
      triggerNotification("Wrong username or password.", 5);
    }
  };

  const handleLogout = () => {
    console.log("Successfully logged out.");
    window.localStorage.removeItem("loggedBlogAppUser");
    blogService.setToken(null);
    setUser(null);
    setBlogs([]);
  };

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility();

      const existingBlog = blogs.find((b) => b.title === blogObject.title);

      if (existingBlog) {
        triggerNotification(
          `Blog with title "${blogObject.title}" already exists.`,
          5,
        );
        return;
      }

      const blogToCreate = {
        ...blogObject,
        user: { username: user.username, name: user.name, id: user.id }, // Add user details here
      };
      const returnedBlog = await blogService.create(blogToCreate);
      const { title, author } = returnedBlog;

      setBlogs(blogs.concat(returnedBlog));
      triggerNotification(
        `A new blog "${title}" by ${author} has been added.`,
        5,
      );
    } catch (err) {
      console.error("Error creating blog:", err);
      triggerNotification("Error posting blog.", 5);
    }
  };

  const handleLike = async (event, id) => {
    event.preventDefault();

    try {
      const blog = blogs.find((b) => b.id === id);
      const updatedBlog = { ...blog, likes: blog.likes + 1 };

      await blogService.update(id, updatedBlog).then((returnedBlog) => {
        setBlogs(blogs.map((blog) => (blog.id !== id ? blog : returnedBlog)));
      });
    } catch (err) {
      console.error("Error liking blog:", err);
      triggerNotification("Error liking blog", 5);
    }
  };

  const handleDelete = async (event, id) => {
    event.preventDefault();

    try {
      const blog = blogs.find((b) => b.id === id);
      const { title, author } = blog;
      const accept = window.confirm(`Delete blog "${title}" by ${author}?`);

      if (accept) {
        await blogService.remove(id).then(() => {
          setBlogs(blogs.filter((blog) => blog.id !== id));
          triggerNotification(
            `Blog "${title}" by ${author} has been removed from the server.`,
            5,
          );
        });
      }
    } catch (err) {
      console.error("Error deleting blog:", err);
      triggerNotification("Error deleting blog", 5);
    }
  };

  const LoginView = () => {
    return (
      <div>
        <h1>log in to application</h1>

        <Notification message={notification} />

        <form onSubmit={handleLogin} className="login-form">
          <div>
            <label htmlFor="username">Username</label>:{" "}
            <input
              type="text"
              id="username"
              name="username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>{" "}
            <input
              type="password"
              id="password"
              name="password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    );
  };

  const HomeView = () => {
    return (
      <div>
        <div>
          <h1>blogs</h1>

          <Notification message={notification} />

          <p className="user-name">
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </p>
        </div>

        <Togglable buttonLabel={"add blog"} ref={blogFormRef}>
          <BlogForm createBlog={addBlog} />
        </Togglable>

        <div>
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
      </div>
    );
  };

  return <div>{user === null ? LoginView() : HomeView()}</div>;
};

export default App;
