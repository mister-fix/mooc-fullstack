import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Container, Dropdown, Nav, Navbar } from "react-bootstrap";
import { Link, Route, Routes } from "react-router-dom";
import "./app.css";
import Icon from "./components/Icon";
import Notification from "./components/Notification";
import { useNotification } from "./providers/NotificationContext";
import { useUser } from "./providers/UserContext";
import { getBlogs } from "./services/blogs";
import loginService from "./services/login";
import usersService from "./services/users";
import BlogView from "./views/BlogView";
import HomeView from "./views/HomeView";
import LoginView from "./views/LoginView";
import UsersView from "./views/UsersView";
import UserView from "./views/UserView";

const App = () => {
  const queryClient = useQueryClient();
  const [users, setUsers] = useState([]);
  const { showNotification } = useNotification();
  const { user, setUser, clearUser } = useUser();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await usersService.getAll();
        setUsers(users); // Set the users data
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

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

  return (
    <div>
      {user ? (
        <>
          <Navbar expand="lg" className="bg-primary">
            <Container>
              <Navbar.Brand as="span">
                <Link to="/" className="text-white">
                  Blog App
                </Link>
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="main-navbar-nav" />
              <Navbar.Collapse id="main-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Link as="span">
                    <Link to="/" className="text-white">
                      Blogs
                    </Link>
                  </Nav.Link>
                  <Nav.Link as="span">
                    <Link to="/users" className="text-white">
                      Users
                    </Link>
                  </Nav.Link>
                </Nav>
                <Nav>
                  <Dropdown>
                    <Dropdown.Toggle variant="" id="dropdown-basic">
                      <span className="text-white">{user.username}</span>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item href="#/action-3" onClick={handleLogout}>
                        Logout <Icon name="LogOut" size={14} />
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>

          <Notification />

          <div>
            <Routes>
              <Route
                index
                element={
                  <HomeView user={user} blogs={blogs} isPending={isPending} />
                }
              />
              <Route path="/users" element={<UsersView users={users} />} />
              <Route path="/users/:id" element={<UserView users={users} />} />
              <Route
                path="/blogs/:id"
                element={<BlogView users={users} blogs={blogs} />}
              />
            </Routes>
          </div>
        </>
      ) : (
        LoginView({ handleLogin })
      )}
    </div>
  );
};

export default App;
