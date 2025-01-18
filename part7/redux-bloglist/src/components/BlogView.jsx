// BlogView.jsx

import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

const BlogView = ({ handleLike }) => {
  // Destructure handleLike from props
  const { id } = useParams();
  const blogs = useSelector((state) => state.blogs);
  const blog = blogs.find((b) => b.id === id);

  if (!blog) {
    return null;
  }

  return (
    <div>
      <h2>{blog.title}</h2>
      <Link to={`${blog.url}`}>{blog.url}</Link>
      <div>
        {blog.likes} likes
        <button onClick={(event) => handleLike(event, blog.id)}>
          like
        </button>{' '}
        {/* Use handleLike */}
      </div>
      <div>
        <h3>comments</h3>
        {blog.comments && blog.comments.length > 0 ? (
          <ul>
            {blog.comments.map((comment) => (
              <li key={comment.id}>{comment.content}</li>
            ))}
          </ul>
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
    </div>
  );
};

export default BlogView;
