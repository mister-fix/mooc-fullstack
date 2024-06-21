import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";

const App = () => {
	const [blogs, setBlogs] = useState([]);
	const [user, setUser] = useState(null);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [notification, setNotification] = useState({
		message: null,
		type: null,
	});

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON); // Fixing JSON.parse here
			setUser(user);
			blogService.setToken(user.token);
			blogService.getAll().then((blogs) => setBlogs(blogs));
		}
	}, []);

	const handleLogin = async (event) => {
		event.preventDefault();

		try {
			const user = await loginService.login({ username, password });

			window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
			blogService.setToken(user.token);

			setUser(user);
			setUsername("");
			setPassword("");

			blogService.getAll().then((blogs) => setBlogs(blogs));
			setNotification({ message: null, type: null });
		} catch (exception) {
			setNotification({ message: "wrong username or password", type: "error" });
			setTimeout(() => {
				setNotification({ message: null, type: null });
			}, 5000);
		}
	};

	const blogFormRef = useRef();

	const addBlog = (blogObject) => {
		blogFormRef.current.toggleVisibility();
		const blogToCreate = {
			...blogObject,
			user: { username: user.username, name: user.name, id: user.id }, // Add user details here
		};
		blogService.create(blogToCreate).then((returnedBlog) => {
			setBlogs(blogs.concat(returnedBlog));
			setNotification({
				message: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
				type: "success",
			});
			setTimeout(() => {
				setNotification({ message: null, type: null });
			}, 5000);
		});
	};

	const handleLike = (event, id) => {
		event.preventDefault();

		const blog = blogs.find((b) => b.id === id);
		const updatedBlog = { ...blog, likes: blog.likes + 1 };
		blogService.update(id, updatedBlog).then((returnedBlog) => {
			setBlogs(blogs.map((blog) => (blog.id !== id ? blog : returnedBlog)));
		});
	};

	const handleDelete = (event, id) => {
		event.preventDefault();

		const blog = blogs.find((b) => b.id === id);
		const accept = window.confirm(
			`Remove blog ${blog.title} by ${blog.author}?`
		);

		if (accept) {
			blogService.remove(id).then(() => {
				setBlogs(blogs.filter((blog) => blog.id !== id));
				setNotification({
					message: `Blog '${blog.title} by ${blog.author}' has been removed from the server`,
					type: "warning",
				});
				setTimeout(() => {
					setNotification({ message: null, type: null });
				}, 5000);
			});
		} else {
			setNotification({
				message: `Blog ${blog.title} has already been removed from the server`,
				type: "warning",
			});
			setTimeout(() => {
				setNotification({ message: null, type: null });
			}, 5000);
		}
	};

	const handleLogout = () => {
		console.log("logged out");
		window.localStorage.removeItem("loggedBlogAppUser");
		blogService.setToken(null);
		setUser(null);
		setBlogs([]); // Clear blogs on logout
	};

	const loginView = () => (
		<div>
			<h2>log in to application</h2>

			<Notification
				message={notification.message}
				type={notification.type}
			/>

			<form onSubmit={handleLogin}>
				<div>
					username
					<input
						type="text"
						value={username}
						name="Username"
						onChange={({ target }) => setUsername(target.value)}
					/>
				</div>
				<div>
					password
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

				<Notification
					message={notification.message}
					type={notification.type}
				/>
				<p>
					{user.name} logged in <button onClick={handleLogout}>logout</button>
				</p>
			</div>

			<Togglable
				buttonLabel={"add blog"}
				ref={blogFormRef}
			>
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
