import { Link } from 'react-router-dom';

const BlogList = ({ blogs }) => {
  if (!blogs || blogs.length === 0) {
    return <p>No blogs available.</p>;
  }

  return (
    <ul>
      {blogs.map((blog) => {
        <li key={blog.id}>
          <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
        </li>;
      })}
    </ul>
  );
};

export default BlogList;
