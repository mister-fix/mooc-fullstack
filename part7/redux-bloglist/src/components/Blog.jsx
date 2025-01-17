import { Link } from 'react-router-dom';

const Blog = ({ blog }) => {
  const blogStyle = {
    padding: '10px 0 0 2px',
    border: '1px solid black',
    marginBottom: 5,
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
