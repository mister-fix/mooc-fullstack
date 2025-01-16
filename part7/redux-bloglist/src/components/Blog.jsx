import { useState } from 'react';
import { Link } from 'react-router-dom';

const Blog = ({ blog, handleLike, handleDelete }) => {
  const [visibility, setVisibility] = useState(false);
  const showWhenVisible = { display: visibility ? '' : 'none' };
  const blogStyle = {
    padding: '10px 0 0 2px',
    border: '1px solid black',
    marginBottom: 5,
  };

  const toggleVisibility = () => {
    setVisibility(!visibility);
  };

  const matchUser = () => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');

    if (loggedUserJSON && blog.user) {
      const { username } = JSON.parse(loggedUserJSON);
      return username === blog.user.username;
    }

    return false;
  };

  return (
    <div style={blogStyle} className="blog">
      <Link to={`blogs/${blog.id}`} className="blog-title">
        {blog.title}
      </Link>
    </div>
  );
};

export default Blog;
