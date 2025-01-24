import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Route, Routes } from "react-router-dom";
import "./app.css";
import Notification from "./components/Notification";
import { useNotification } from "./providers/NotificationContext";
import { useUser } from "./providers/UserContext";
import { getBlogs } from "./services/blogs";
import loginService from "./services/login";
import HomeView from "./views/HomeView";
import LoginView from "./views/LoginView";
import UsersView from "./views/UsersView";

const App = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  const { user, setUser, clearUser } = useUser();

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
          <div>
            <h1>blogs</h1>

            <Notification />

            <p className="user-name">
              {user.name} logged in{" "}
              <button onClick={handleLogout}>logout</button>
            </p>
          </div>

          <div>
            <Routes>
              <Route
                index
                element={
                  <HomeView user={user} blogs={blogs} isPending={isPending} />
                }
              />
              <Route path="/users" element={<UsersView />} />
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
