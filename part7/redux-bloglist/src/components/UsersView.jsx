import Table from 'react-bootstrap/Table';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const UsersView = ({ users }) => {
  const user = useSelector((state) => state.user);

  if (!user) {
    return null;
  }

  return (
    <div className="container">
      <div>
        <h2>Users</h2>

        <Table striped bordered>
          <thead>
            <tr>
              <th>All users</th>
              <th>Blogs created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <Link to={`/users/${user.id}`}>{user.name}</Link>
                </td>
                <td>{user.blogs.length}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default UsersView;
