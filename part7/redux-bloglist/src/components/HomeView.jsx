import { useSelector } from 'react-redux';
import Blog from './Blog';
import BlogForm from './BlogForm';
import Togglable from './Togglable';

const HomeView = ({ blogFormRef, addBlog, handleLike, handleDelete }) => {
  const blogs = useSelector((state) => state.blogs);

  return (
    <div>
      <Togglable buttonLabel={'create new'} ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            handleLike={handleLike}
            handleDelete={handleDelete}
          />
        ))}
    </div>
  );
};

export default HomeView;
