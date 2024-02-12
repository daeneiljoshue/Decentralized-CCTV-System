import React, { useState, useEffect } from 'react';

const UserList = ({ onUserSelect }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('/api/users'); // Replace with your API endpoint
      const data = await response.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const handleUserClick = (userId) => {
    onUserSelect(userId);
  };

  return (
    <div className="user-list">
      <h3>User List</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} onClick={() => handleUserClick(user.id)}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                {/* Action buttons (e.g., Edit, Delete) */}
                <button>Edit</button>
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
