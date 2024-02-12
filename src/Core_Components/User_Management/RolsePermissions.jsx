import React, { useState, useEffect } from 'react';

const RolePermissions = ({ userId, onPermissionsChange }) => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    // Fetch roles and permissions for the given user (replace with your API call)
    const fetchRolesAndPermissions = async () => {
      const response = await fetch(`/api/users/${userId}/rolesAndPermissions`);
      const data = await response.json();
      setRoles(data.roles);
      setSelectedRole(data.roles[0].id); // Select first role initially
      setPermissions(data.permissions);
    };
    fetchRolesAndPermissions();
  }, [userId]);

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
    // Fetch permissions for the selected role (replace with your API call)
    const fetchPermissions = async () => {
      const response = await fetch(`/api/roles/${event.target.value}/permissions`);
      const data = await response.json();
      setPermissions(data);
    };
    fetchPermissions();
  };

  const handlePermissionChange = (permissionId, isChecked) => {
    // Update permissions in state and potentially send to API (replace with your logic)
    const updatedPermissions = [...permissions];
    const permissionIndex = updatedPermissions.findIndex((p) => p.id === permissionId);
    updatedPermissions[permissionIndex].granted = isChecked;
    setPermissions(updatedPermissions);
    onPermissionsChange(updatedPermissions); // Inform parent component about changes
  };

  return (
    <div className="role-permissions">
      <h3>Roles and Permissions</h3>
      <select value={selectedRole} onChange={handleRoleChange}>
        {roles.map((role) => (
          <option key={role.id} value={role.id}>
            {role.name}
          </option>
        ))}
      </select>
      <ul className="permissions-list">
        {permissions.map((permission) => (
          <li key={permission.id}>
            <input
              type="checkbox"
              checked={permission.granted}
              onChange={() => handlePermissionChange(permission.id, !permission.granted)}
            />
            {permission.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RolePermissions;
