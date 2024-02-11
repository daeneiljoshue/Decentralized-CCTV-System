import React, { useState } from 'react';
import CameraSettings from './CameraSettings';
import SystemConfig from './SystemConfig';
import UserPreferences from './UserPreferences';
import UserList from '../User_Management/UserList'; // Reference existing component

const App = () => {
  const [selectedTab, setSelectedTab] = useState('cameras'); // Initial tab

  return (
    <div className="settings-container">
      <nav>
        <button onClick={() => setSelectedTab('cameras')}>Camera Settings</button>
        <button onClick={() => setSelectedTab('system')}>System Config</button>
        <button onClick={() => setSelectedTab('userPreferences')}>User Preferences</button>
        <button onClick={() => setSelectedTab('users')}>User Management</button>
      </nav>
      {selectedTab === 'cameras' && <CameraSettings />}
      {selectedTab === 'system' && <SystemConfig />}
      {selectedTab === 'userPreferences' && <UserPreferences />}
      {selectedTab === 'users' && <UserList />}
    </div>
  );
};

export default App;
