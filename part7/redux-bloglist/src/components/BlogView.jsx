// BlogView.jsx

import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { getAllBlogs } from '../reducers/blogsReducer';
import blogService from '../services/blogs';

const BlogView = ({ handleLike }) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const blogs = useSelector((state) => state.blogs);
  const blog = blogs.find((b) => b.id === id);

  if (!blog) {
    return null;
  }

  const postComment = async (event) => {
    event.preventDefault();
    const comment = event.target.comment.value;

    try {
      await blogService.addComment(blog.id, comment);

      dispatch(getAllBlogs());

      event.target.reset(); // Clear the input field
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  return (
    <div className="container my-4">
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
        <form onSubmit={postComment}>
          <input type="text" name="comment" />
          <button type="submit">add comment</button>
        </form>
        {blog.comments && blog.comments.length > 0 ? (
          <ul>
            {blog.comments.map((comment) => (
              <li key={comment.id}>{comment.content}</li>
            ))}
          </ul>
        ) : (
          <p style={{ marginTop: 20 }}>No comments yet.</p>
        )}
      </div>
    </div>
  );
};

export default BlogView;
