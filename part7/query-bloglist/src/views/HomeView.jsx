import { useRef } from "react";
import Blog from "../components/Blog";
import BlogForm from "../components/BlogForm";
import Togglable from "../components/Togglable";
import { useCreateBlog } from "../hooks/useBlogMutations";
import { useNotification } from "../providers/NotificationContext";

const HomeView = ({ user, isPending, blogs }) => {
  const blogFormRef = useRef();
  const { showNotification } = useNotification();
  const { mutate: createBlog } = useCreateBlog();

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
              <Blog key={blog.id} blog={blog} />
            ))}
        </div>
      )}
    </div>
  );
};

export default HomeView;
