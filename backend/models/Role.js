const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const Role = sequelize.define('Role', {
    // Essential fields
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true, // Ensure unique role names
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    permissions: {
      type: Sequelize.JSON, // Store permissions as a JSON object
      allowNull: true,
    },
  });

  // Define relationships (adapt model names as needed)
  Role.belongsToMany(Permission, { through: 'RolePermission' }); // Many-to-many with Permission
  Role.belongsToMany(User, { through: 'UserRole' }); // Many-to-many with User

  return Role;
};
