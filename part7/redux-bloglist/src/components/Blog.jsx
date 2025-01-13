import { useState } from 'react';

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
      <p className="blog-title">{blog.title}</p>
      <p className="blog-author">{blog.author}</p>{' '}
      <button onClick={toggleVisibility}>{visibility ? 'hide' : 'view'}</button>
      <div style={showWhenVisible}>
        <p className="blog-url">{blog.url}</p>
        <p className="blog-likes">
          {blog.likes} likes{' '}
          <button onClick={(event) => handleLike(event, blog.id)}>like</button>
        </p>
        {/* <p>{blog.user.name}</p>*/}
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
