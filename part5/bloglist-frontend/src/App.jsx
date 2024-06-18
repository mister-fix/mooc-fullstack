import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
	const [blogs, setBlogs] = useState([]);
	const [user, setUser] = useState(null);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [blogTitle, setBlogTitle] = useState("");
	const [blogAuthor, setBlogAuthor] = useState("");
	const [blogUrl, setBlogUrl] = useState("");
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

	const addBlog = async (event) => {
		event.preventDefault();

		const blogObject = {
			title: blogTitle,
			author: blogAuthor,
			url: blogUrl,
		};

		blogService.create(blogObject).then((returnedBlog) => {
			setBlogs(blogs.concat(returnedBlog));
			setBlogAuthor("");
			setBlogTitle("");
			setBlogUrl("");
			setNotification({
				message: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
				type: "success",
			});
			setTimeout(() => {
				setNotification({ message: null, type: null });
			}, 5000);
		});
	};

	const handleLogout = () => {
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

			<div>
				<h2>create new</h2>
				<form onSubmit={addBlog}>
					<div>
						title:
						<input
							type="text"
							name="Title"
							value={blogTitle}
							onChange={({ target }) => setBlogTitle(target.value)}
						/>
					</div>
					<div>
						author
						<input
							type="text"
							name="Title"
							value={blogAuthor}
							onChange={({ target }) => setBlogAuthor(target.value)}
						/>
					</div>
					<div>
						url
						<input
							type="text"
							name="Title"
							value={blogUrl}
							onChange={({ target }) => setBlogUrl(target.value)}
						/>
					</div>
					<button type="submit">create</button>
				</form>
			</div>
			{blogs.map((blog) => (
				<Blog
					key={blog.id}
					blog={blog}
				/>
			))}
		</div>
	);

	return <div>{user === null ? loginView() : blogView()}</div>;
};

export default App;
