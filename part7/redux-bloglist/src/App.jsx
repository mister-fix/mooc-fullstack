import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Route, Routes } from 'react-router-dom';
import BlogView from './components/BlogView';
// import HomeView from './components/HomeView';
import BlogForm from './components/BlogForm';
// import LoginView from './components/LoginView';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Table from 'react-bootstrap/Table';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import UsersView from './components/UsersView';
import UserView from './components/UserView';
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

  const LoginView = () => (
    <div>
      <h2>log in to application</h2>

      <Notification />

      <form onSubmit={handleLogin}>
        <Form.Group>
          <Form.Label>username:</Form.Label>
          <Form.Control type="text" name="username" />
        </Form.Group>
        <Form.Group>
          <Form.Label>password:</Form.Label>
          <Form.Control type="password" name="password" />
        </Form.Group>
        <Button type="submit" className="my-2">
          login
        </Button>
      </form>
    </div>
  );

  const HomeView = () => {
    return (
      user && (
        <div className="container">
          <Togglable buttonLabel={'create new'} ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>

          <div className="my-5">
            <Table striped bordered hover>
              <tbody>
                {blogs
                  .sort((a, b) => b.likes - a.likes)
                  .map((blog) => (
                    <tr key={blog.id}>
                      <td>
                        <Link key={blog.id} to={`/blogs/${blog.id}`}>
                          {blog.title}
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </div>
        </div>
      )
    );
  };

  return (
    <>
      <div className="container">
        {user ? (
          <>
            <Navbar expand="lg" className="bg-body-tertiary">
              <Container>
                <Navbar.Brand href="#home">Blog App</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="me-auto">
                    <Nav.Link href="#" as="span">
                      <Link to="/">Blogs</Link>
                    </Nav.Link>
                    <Nav.Link href="#" as="span">
                      <Link to="/users">Users</Link>
                    </Nav.Link>
                  </Nav>
                  <Nav className="ms-auto">
                    <Nav.Link href="#" as="span" className="my-auto">
                      <span>{user.name} logged in</span>
                    </Nav.Link>
                    <Nav.Link href="#" as="span" className="ms-auto">
                      <Button variant="primary" onClick={handleLogout}>
                        logout
                      </Button>
                    </Nav.Link>
                  </Nav>
                </Navbar.Collapse>
              </Container>
            </Navbar>

            <div className="my-4">
              <h1>blog app</h1>
            </div>
          </>
        ) : (
          LoginView()
        )}
      </div>

      <Routes>
        <Route index element={<HomeView />} />
        <Route path="/users" element={<UsersView users={users} />} />
        <Route path="/users/:id" element={<UserView users={users} />} />
        <Route
          path="/blogs/:id"
          element={<BlogView handleLike={handleLike} />}
        />
      </Routes>
    </>
  );
};

export default App;
