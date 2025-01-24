import { useRef } from "react";
import Blog from "../components/Blog";
import BlogForm from "../components/BlogForm";
import Togglable from "../components/Togglable";
import {
  useCreateBlog,
  useDeleteBlog,
  useLikeBlog,
} from "../hooks/useBlogMutations";
import { useNotification } from "../providers/NotificationContext";

const HomeView = ({ user, isPending, blogs }) => {
  const blogFormRef = useRef();
  const { mutate: createBlog } = useCreateBlog();
  const { mutate: likeBlog } = useLikeBlog();
  const { mutate: deleteBlog } = useDeleteBlog();
  const { showNotification } = useNotification();

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility();

    const existingBlog = blogs.find((b) => b.title === blogObject.title);

    if (existingBlog) {
      showNotification(
        `Blog with title "${blogObject.title}" already exists.`,
        5,
      );
      return;
    }

    const blogToCreate = {
      ...blogObject,
      user: { username: user.username, name: user.name, id: user.id }, // Add user details here
    };

    createBlog(blogToCreate, {
      onSuccess: (newBlog) => {
        const { title, author } = newBlog;
        showNotification(
          `A new blog "${title}" by ${author} has been added.`,
          5,
        );
      },
    });
  };

  const handleLike = async (event, id) => {
    event.preventDefault();

    const blog = blogs.find((b) => b.id === id);

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
        },
        onError: () => {
          showNotification("Error removing blog", 5);
        },
      });
    }
  };

  return (
    <div>
      <Togglable buttonLabel={"add blog"} ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      {isPending && <div>Loading blogs...</div>}

      {blogs && (
        <div>
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
      )}
    </div>
  );
};

export default HomeView;
