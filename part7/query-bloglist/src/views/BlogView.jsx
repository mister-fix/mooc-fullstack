import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDeleteBlog, useLikeBlog } from "../hooks/useBlogMutations";
import { useNotification } from "../providers/NotificationContext";

const BlogView = ({ blogs }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { id } = useParams();
  const { mutate: likeBlog } = useLikeBlog();
  const { mutate: deleteBlog } = useDeleteBlog();
  const { showNotification } = useNotification();

  if (!blogs || blogs.length === 0) {
    return <div>Loading...</div>;
  }

  const blog = blogs.find((b) => b.id === id);

  if (!blog) {
    return <div>Blog not found.</div>;
  }

  const matchUser = () => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");

    if (loggedUserJSON && blog.user) {
      const { username } = JSON.parse(loggedUserJSON);
      return username === blog.user.username;
    }

    return false;
  };

  const handleLike = async (event, id) => {
    event.preventDefault();

    console.log(blog);

    likeBlog(
      { id, updatedBlog: { ...blog, likes: blog.likes + 1 } },
      {
        onError: () => {
          showNotification("Error liking blog", 5);
        },
      },
    );
  };

  const handleDelete = async (event, id) => {
    event.preventDefault();

    const blog = blogs.find((b) => b.id === id);
    const { title, author } = blog;
    const accept = window.confirm(`Delete blog "${title}" by ${author}?`);

    if (accept) {
      deleteBlog(id, {
        onSuccess: () => {
          showNotification(`Blog "${title}: by ${author} has been removed.`, 5);
          queryClient.invalidateQueries("blogs");
          navigate("/");
        },
        onError: () => {
          showNotification("Error removing blog", 5);
        },
      });
    }
  };

  return (
    <div className="blog-view">
      <h3 className="blog-title">{blog.title}</h3>
      <Link className="blog-link">{blog.url}</Link>
      <p className="blog-likes">
        {blog.likes} likes{" "}
        <button onClick={(event) => handleLike(event, blog.id)}>like</button>
      </p>
      <p>added by {blog.user.name}</p>
      {matchUser() && (
        <button onClick={(event) => handleDelete(event, blog.id)}>
          remove
        </button>
      )}
    </div>
  );
};

export default BlogView;
