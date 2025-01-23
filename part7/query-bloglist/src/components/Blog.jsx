import { useState } from "react";

const Blog = ({ blog, handleLike, handleDelete }) => {
  const [visibility, setVisibility] = useState(false);
  const showWhenVisible = { display: visibility ? "" : "none" };

  const toggleVisibility = () => {
    setVisibility(!visibility);
  };

  const matchUser = () => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");

    if (loggedUserJSON && blog.user) {
      const { username } = JSON.parse(loggedUserJSON);
      return username === blog.user.username;
    }

    return false;
  };

  return (
    <div className="blog">
      <p className="blog-title">{blog.title}</p>
      <p className="blog-author">{blog.author}</p>
      <button onClick={toggleVisibility}>{visibility ? "hide" : "show"}</button>

      <div style={showWhenVisible}>
        <p className="blog-url">
          <a href="#" target="_blank" rel="noopener noreferrer">
            {blog.url}
          </a>
        </p>
        <p className="blog-likes">
          likes {blog.likes}{" "}
          <button onClick={(event) => handleLike(event, blog.id)}>like</button>
        </p>
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
