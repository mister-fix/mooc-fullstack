import { useState } from "react";

const Blog = ({ blog, handleLike, handleDelete }) => {
	const [visibility, setVisibility] = useState(false);
	const showWhenVisibile = { display: visibility ? "" : "none" };
	const blogStyle = {
		paddingTop: 10,
		paddingLeft: 2,
		border: "solid",
		borderWidth: 1,
		marginBottom: 5,
	};

	const toggleVisibility = () => {
		setVisibility(!visibility);
	};

	const matchUser = () => {
		const { username } = JSON.parse(
			window.localStorage.getItem("loggedBlogAppUser")
		);

		return username === blog.user.username;
	};

	return (
		<div style={blogStyle}>
			<div>
				{blog.title} {blog.author}{" "}
				<button onClick={toggleVisibility}>
					{visibility ? "hide" : "view"}
				</button>
			</div>

			<div style={showWhenVisibile}>
				<p>{blog.url}</p>
				<p>
					likes {blog.likes}{" "}
					<button onClick={(event) => handleLike(event, blog.id)}>like</button>
				</p>
				<p>{blog.user.name}</p>
				{matchUser() && (
					<button onClick={(event) => handleDelete(event, blog.id)}>
						remove
					</button>
				)}
			</div>
		</div>
	);
};

export default Blog;
