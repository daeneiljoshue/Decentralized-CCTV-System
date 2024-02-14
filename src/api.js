// Replace with your actual API base URL
const BASE_URL = 'http://localhost:3000';

export const fetchUsers = async () => {
  const response = await fetch(`${BASE_URL}/users`);
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return await response.json();
};

export const fetchUserById = async (userId) => {
  const response = await fetch(`${BASE_URL}/users/${userId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch user with ID ${userId}`);
  }
  return await response.json();
};

export const saveUser = async (user) => {
  const { id, ...userData } = user; // Destructure ID for conditional logic
  const method = id ? 'PUT' : 'POST'; // Use PUT for updates, POST for creating new users
  const url = id ? `${BASE_URL}/users/${id}` : `${BASE_URL}/users`;

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error(`Failed to ${method === 'PUT' ? 'update' : 'create'} user`);
  }

  return await response.json();
};

// Add other API calls as needed
