import React, { useState, useEffect } from 'react';

const UserForm = ({ userId, onSubmit }) => {
  const [user, setUser] = useState({});
  const [initialUser, setInitialUser] = useState({}); // To track original data for updates

  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();
        setUser(data);
        setInitialUser(data); // Store initial data for comparison
      } else {
        // Set initial state for creating a new user
        setUser({ name: '', email: '' });
      }
    };
    fetchUser();
  }, [userId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate user data before submitting (replace with your validation logic)
    // ... perform validation

    try {
      const response = userId
        ? await fetch(`/api/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(user),
          })
        : await fetch('/api/users', {
            method: 'POST',
            body: JSON.stringify(user),
          });

      if (!response.ok) {
        throw new Error('Failed to save user');
      }

      // Handle successful save (e.g., show success message, redirect to user list)
      console.log('User saved successfully');
      onSubmit(); // Trigger parent component to handle success

    } catch (error) {
      console.error('Error saving user:', error);
      // Handle errors (e.g., show error message)
    }
  };

  return (
    <div className="user-form">
      <h3>{userId ? 'Edit User' : 'Create User'}</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input type="text" name="name" value={user.name} onChange={handleChange} />
        <label htmlFor="email">Email:</label>
        <input type="email" name="email" value={user.email} onChange={handleChange} />
        {userId && (
          <div>
            {/* Additional fields for editing existing users, e.g., password change */}
          </div>
        )}
        <button type="submit">{userId ? 'Save Changes' : 'Create User'}</button>
      </form>
    </div>
  );
};

export default UserForm;
