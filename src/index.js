import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import core components
import Dashboard from './Core_Components/Dashboard/App.jsx';
import CameraView from './Core_Components/Camera_View/App';
import EventManagement from './Core_Components/Event_Management/App';
import Settings from './Core_Components/Settings/App';
import UserManagement from './Core_Components/Event_Management/App.jsx';


// Replace with your actual API client or service
import { fetchUsers, fetchUserById, saveUser} from './api';

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch initial user data
    const fetchInitialUsers = async () => {
      const data = await fetchUsers();
      setUsers(data);
    };
    fetchInitialUsers();
  }, []);

  // Example API call for editing a user (replace with your logic)
  const handleUserSave = async (user) => {
    const updatedUser = await saveUser(user);
    // Update local state or API data as needed
    setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/cameras/:cameraId" element={<CameraView />} />
        <Route path="/events" element={<EventManagement />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/users">
          {/* Pass users data and save handler as props */}
          <Route index element={<UserManagement users={users} onSave={handleUserSave} />} />
          <Route path=":userId" element={<UserManagement users={users} onSave={handleUserSave} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
