import { useParams } from 'react-router-dom';

const UserView = ({ users }) => {
  const { id } = useParams();
  const user = users.find((u) => u.id === id);

  if (!user) {
    return null;
  }

  return (
    <div>
      <h2>{user.name}</h2>

      <div>
        <h3>added blogs</h3>

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
