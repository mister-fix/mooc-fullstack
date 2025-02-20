import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useAddComment,
  useDeleteBlog,
  useLikeBlog,
} from "../hooks/useBlogMutations";
import { useNotification } from "../providers/NotificationContext";
import { getBlogById } from "../services/blogs";

const BlogView = ({ blogs }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams();
  const { showNotification } = useNotification();

  const {
    data: blog,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["blog"],
    queryFn: () => getBlogById(id),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const { mutate: likeBlog } = useLikeBlog();
  const { mutate: deleteBlog } = useDeleteBlog();
  const { mutate: addComment } = useAddComment();

  if (isLoading) return <div>Loading...</div>;
  if (isError || !blog) return <div>Blog not found.</div>;

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

  const handleCommenting = async (event) => {
    event.preventDefault();

    const comment = { content: event.target.comment.value };

    addComment(
      { id: blog.id, comment },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["blog"]);
          event.target.reset;
          showNotification("Comment added", 5);
        },
        onError: () => showNotification("Error adding comment", 5),
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
      <div>
        <h3 className="blog-title">{blog.title}</h3>
        <Link className="blog-link">{blog.url}</Link>
        <p className="blog-likes">
          {blog.likes} likes{" "}
          <button onClick={(event) => handleLike(event, blog.id)}>like</button>
        </p>
        <p>added by {blog.user.name}</p>
        {matchUser() && (
          <button
            style={{ marginTop: 12 }}
            onClick={(event) => handleDelete(event, blog.id)}
          >
            remove
          </button>
        )}
      </div>

      <div className="blog-view-comments">
        <h3 style={{ marginTop: 30, marginBottom: 12 }}>comments</h3>

        <form onSubmit={handleCommenting}>
          <div style={{ display: "flex" }}>
            <input type="text" id="comment" name="comment" />
            <button type="submit">add comment</button>
          </div>
        </form>

        {blog.comments && blog.comments.length > 0 ? (
          <ul style={{ marginTop: 16 }}>
            {blog.comments.map((c) => (
              <li key={c.id}>{c.content}</li>
            ))}
          </ul>
        ) : (
          <p style={{ marginTop: 12 }}>No comments yet.</p>
        )}
      </div>
    </div>
  );
};

export default BlogView;
