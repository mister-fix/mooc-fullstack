import { useParams } from "react-router-dom";

const UserView = ({ users }) => {
  const { id } = useParams();
  const user = users.find((u) => u.id === id);

  if (!user) {
    return (
      <div>
        <h3>User not found</h3>
      </div>
    );
  }

  return (
    <div className="user-view">
      <h2>{user.name}</h2>

      <div className="user-blogs">
        <h3 className="user-blogs-heading">added blogs</h3>

        <ul>
          {user.blogs.map((blog) => (
            <li key={blog.id}>{blog.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserView;
