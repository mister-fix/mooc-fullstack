import { useState } from "react";

const BlogForm = ({ createBlog }) => {
	const [title, setTitle] = useState("");
	const [author, setAuthor] = useState("");
	const [url, setUrl] = useState("");

	const createNewBlog = (event) => {
		event.preventDefault();

		createBlog({
			title,
			author,
			url,
		});

		setTitle("");
		setAuthor("");
		setUrl("");
	};

	return (
		<div>
			<h2>create new</h2>
			<form onSubmit={createNewBlog}>
				<div>
					title:
					<input
						type="text"
						name="Title"
						value={title}
						onChange={({ target }) => setTitle(target.value)}
					/>
				</div>
				<div>
					author
					<input
						type="text"
						name="Author"
						value={author}
						onChange={({ target }) => setAuthor(target.value)}
					/>
				</div>
				<div>
					url
					<input
						type="text"
						name="URL"
						value={url}
						onChange={({ target }) => setUrl(target.value)}
					/>
				</div>
				<button type="submit">create</button>
			</form>
		</div>
	);
};

export default BlogForm;
