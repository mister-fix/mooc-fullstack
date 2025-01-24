import { createContext, useContext, useEffect, useReducer } from "react";
import { setToken } from "../services/blogs";

const UserContext = createContext();

const userReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "CLEAR_USER":
      return { ...state, user: null };
    default:
      return state;
  }
};

const UserProvider = ({ children }) => {
  const initialState = {
    user: null,
  };

  const [state, dispatch] = useReducer(userReducer, initialState);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch({ type: "SET_USER", payload: user });
      setToken(user.token);
    }
  }, []);

  const setUser = (user) => {
    dispatch({ type: "SET_USER", payload: user });
    window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
    setToken(user.token);
  };

  const clearUser = () => {
    dispatch({ type: "CLEAR_USER" });
    window.localStorage.removeItem("loggedBlogAppUser");
    setToken(null);
  };

  return (
    <UserContext.Provider value={{ user: state.user, setUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};

export default UserProvider;
