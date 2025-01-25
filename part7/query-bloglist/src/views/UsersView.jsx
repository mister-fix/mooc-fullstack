import { Container, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

const UsersView = ({ users }) => {
  return (
    <div className="users-view">
      <Container>
        <h2 className="mb-3">Users</h2>

        <Table striped bordered>
          <thead>
            <tr className="py-3">
              <th scope="col" style={{ width: "80%" }}>
                Name
              </th>
              <th scope="col" style={{ width: "20%" }}>
                Blogs Created
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="py-3">
                  <Link to={`/users/${u.id}`}>{u.name}</Link>
                </td>
                <td className="py-3">{u.blogs.length}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default UsersView;
