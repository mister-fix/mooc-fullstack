import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Route, Routes, useParams } from 'react-router-dom';
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
import usersService from './services/users';

const App = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => {
    const sortedBlogs = [...state.blogs].sort((a, b) => b.likes - a.likes);
    return sortedBlogs;
  });
  const user = useSelector((state) => state.user?.user || null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON); // Fixing JSON.parse here
      blogService.setToken(user.token);
      dispatch(setUser(user)); // Set user in the Redux store

      // verifying token validity by attempting to retrieve blogs
      dispatch(initializeBlogs());

      const fetchUsers = async () => {
        try {
          const users = await usersService.getAll();
          setUsers(users); // Set the users data
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };

      fetchUsers();
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

  const HomeView = () => (
    <div>
      <Togglable buttonLabel={'create new'} ref={blogFormRef}>
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

  const BlogView = () => {
    const { id } = useParams();
    const blog = blogs.find((b) => b.id === id);

    if (!blog) {
      return <div>Blog not found.</div>;
    }

    return (
      <div>
        <h2>{blog.title}</h2>
        <Link to={`${blog.url}`}>{blog.url}</Link>
        <div>
          {blog.likes} likes{' '}
          <button onClick={(event) => handleLike(event, blog.id)}>like</button>
        </div>
        <div>
          <h3>comments</h3>
          {blog.comments && blog.comments.length > 0 ? (
            <ul>
              {blog.comments.map((comment, index) => (
                <li key={comment.id}>{comment.content}</li> // assuming comment is a string, adjust if needed
              ))}
            </ul>
          ) : (
            <p>No comments.</p>
          )}
        </div>
      </div>
    );
  };

  const UsersView = () => {
    return (
      <div>
        <div>
          <h2>Users</h2>

          <table>
            <thead>
              <tr>
                <th></th>
                <th>blogs created</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <Link to={`/users/${user.id}`}>{user.name}</Link>
                  </td>
                  <td>{user.blogs.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const UserView = () => {
    const { id } = useParams();
    const user = users.find((u) => u.id === id);

    if (!user) {
      return <div>User not found.</div>;
    }

    return (
      <div>
        <h2>{user.name}</h2>

        <div>
          <h3>added blogs</h3>

          <ul>
            {user.blogs.map((blog) => (
              <li key={blog.id}>{blog.title}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <>
      <div>
        {user ? (
          <>
            <nav>
              <div>
                <Link className="nav-link" to="/">
                  blogs
                </Link>
                <Link className="nav-link" to="/users">
                  users
                </Link>
              </div>
              <div>
                <p>
                  {user.name} logged in{' '}
                  <button onClick={handleLogout}>logout</button>
                </p>
              </div>
            </nav>

            <div>
              <h1>blog app</h1>
            </div>
          </>
        ) : (
          loginView()
        )}
      </div>

      <Routes>
        <Route index element={<HomeView />} />
        <Route path="/users" element={<UsersView />} />
        <Route path="/users/:id" element={<UserView />} />
        <Route path="/blogs/:id" element={<BlogView />} />
      </Routes>
    </>
  );
};

export default App;
