import { useState } from "react";

const Blog = ({ blog, handleLike }) => {
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

	return (
		<div style={blogStyle}>
			<div>
				{blog.title} {blog.author}
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
			</div>
		</div>
	);
};

export default Blog;
