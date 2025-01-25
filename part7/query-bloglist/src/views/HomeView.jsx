import { useRef } from "react";
import { Container, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
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
    <div className="home-view">
      <Container>
        {/* <h2>blog app</h2> */}

        <Togglable buttonLabel={"Add blog"} ref={blogFormRef}>
          <BlogForm createBlog={addBlog} />
        </Togglable>

        {isPending && <div>Loading blogs...</div>}

        {blogs && (
          <Table striped bordered>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
              </tr>
            </thead>
            <tbody>
              {blogs
                .sort((a, b) => b.likes - a.likes)
                .map((blog) => (
                  <tr key={blog.id}>
                    <td className="py-3 d-flex">
                      <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                    </td>
                    <td className="py-3">
                      <p className="ms-2">{blog.author}</p>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        )}
      </Container>
    </div>
  );
};

export default HomeView;
