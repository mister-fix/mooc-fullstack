import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import "./app.css";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import {
  useCreateBlog,
  useDeleteBlog,
  useLikeBlog,
} from "./hooks/useBlogMutations";
import { useNotification } from "./providers/NotificationContext";
import { getBlogs, setToken } from "./services/blogs";
import loginService from "./services/login";

// * DONE: Retrieving and rendering blog posts using React Query.
// TODO: Ensure that creating, liking, and deleting blogs works.

const App = () => {
  // const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const blogFormRef = useRef();
  const { showNotification } = useNotification();
  const queryClient = useQueryClient();
  const { mutate: createBlog } = useCreateBlog();
  const { mutate: likeBlog } = useLikeBlog();
  const { mutate: deleteBlog } = useDeleteBlog();

  const {
    isPending,
    isError,
    data: blogs,
    error,
  } = useQuery({
    queryKey: ["blogs"],
    queryFn: getBlogs,
    enabled: !!user, // Fetch blogs only if a user is logged in
    retry: false,
    refetchOnWindowFocus: false,
  });

  console.log("blogs:", blogs);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON); // Fixing JSON.parse here

      setUser(user); //Ensure the user is set
      setToken(user.token); // Set the token for authenticated requests
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      setToken(user.token);

      setUser(user);
      setUsername("");
      setPassword("");

      // await blogService.getAll().then((blogs) => setBlogs(blogs));
      showNotification(`Welcome back, ${user.name}!`, 5);
    } catch (err) {
      console.error("Error logging in:", err);
      showNotification("Wrong username or password.", 5);
    }
  };

  const handleLogout = () => {
    console.log("Successfully logged out.");
    window.localStorage.removeItem("loggedBlogAppUser");
    setToken(null);
    setUser(null);
    queryClient.removeQueries(["blogs"]); // Clear cached blogs on logout
  };

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility();

    const existingBlog = blogs.find((b) => b.title === blogObject.title);

    if (existingBlog) {
      showNotification(
        `Blog with title "${blogObject.title}" already exists.`,
        5,
      );
      return;
    }

    const blogToCreate = {
      ...blogObject,
      user: { username: user.username, name: user.name, id: user.id }, // Add user details here
    };

    createBlog(blogToCreate, {
      onSuccess: (newBlog) => {
        const { title, author } = newBlog;
        showNotification(
          `A new blog "${title}" by ${author} has been added.`,
          5,
        );
      },
    });
  };

  const handleLike = async (event, id) => {
    event.preventDefault();

    const blog = blogs.find((b) => b.id === id);

    likeBlog(
      { id, updatedBlog: { ...blog, likes: blog.likes + 1 } },
      {
        onError: () => {
          showNotification("Error liking blog", 5);
        },
      },
    );
  };

  const handleDelete = async (event, id) => {
    event.preventDefault();

    const blog = blogs.find((b) => b.id === id);
    const { title, author } = blog;
    const accept = window.confirm(`Delete blog "${title}" by ${author}?`);

    if (accept) {
      deleteBlog(id, {
        onSuccess: () => {
          showNotification(`Blog "${title}: by ${author} has been removed.`, 5);
        },
        onError: () => {
          showNotification("Error removing blog", 5);
        },
      });
    }
  };

  const LoginView = () => {
    return (
      <div>
        <h1>log in to application</h1>

        <Notification />

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

          <Notification />

          <p className="user-name">
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </p>
        </div>

        <Togglable buttonLabel={"add blog"} ref={blogFormRef}>
          <BlogForm createBlog={addBlog} />
        </Togglable>

        {isPending && <div>Loading blogs...</div>}

        {blogs && (
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
        )}
      </div>
    );
  };

  return <div>{user === null ? LoginView() : HomeView()}</div>;
};

export default App;
