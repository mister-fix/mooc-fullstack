import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
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
import { useUser } from "./providers/UserContext";
import { getBlogs } from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const blogFormRef = useRef();
  const { showNotification } = useNotification();
  const queryClient = useQueryClient();
  const { user, setUser, clearUser } = useUser();
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

  const handleLogin = async (event) => {
    event.preventDefault();

    const username = event.target.username.value;
    const password = event.target.password.value;
    try {
      const user = await loginService.login({ username, password });

      setUser(user);
      showNotification(`Welcome back, ${user.name}!`, 5);
    } catch (err) {
      console.error("Error logging in:", err);
      showNotification("Wrong username or password.", 5);
    }
  };

  const handleLogout = () => {
    console.log("Successfully logged out.");
    clearUser();
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
            <input type="text" id="username" name="username" />
          </div>
          <div>
            <label htmlFor="password">Password</label>{" "}
            <input type="password" id="password" name="password" />
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
