const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const Permission = sequelize.define('Permission', {
    // Essential fields
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true, // Ensure unique permission names
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    module: {
      type: Sequelize.STRING, // Optional field for grouping permissions
      allowNull: true,
    },
  });

  // Define relationships (adapt model names as needed)
  Permission.belongsToMany(Role, { through: 'RolePermission' }); // Many-to-many with Role

  return Permission;
};
