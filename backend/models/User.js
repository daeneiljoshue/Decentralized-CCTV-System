// Adapt validation rules to your specific requirements.
//Define relationships based on your data model.
//Use Sequelize's built-in association methods for defining relationships.
//Regularly update security libraries and dependencies.

const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs'); // Import bcrypt

module.exports = (sequelize) => {
  // Initialize Sequelize (replace with your database credentials)
  if (!sequelize) {
    sequelize = new Sequelize('your_database_name', 'your_username', 'your_password', {
      host: 'your_database_host',
      dialect: 'your_database_dialect', // e.g., 'mysql' or 'postgres'
    });
  }

  const User = sequelize.define('User', {
    // Essential fields (with added validation)
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isLowercase: true,
        isAlphanumeric: true, // Allow only letters, numbers, and underscores
        len: [5, 30], // Enforce username length between 5 and 30 characters
      },
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      set(value) {
        this.setDataValue('password', bcrypt.hashSync(value, 10));
      },
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true, // Validate email format
      },
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
      len: [2, 50], // Enforce first name length
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
      len: [2, 50], // Enforce last name length
    },
    phoneNumber: {
      type: Sequelize.STRING,
      validate: {
        isMobilePhone: true, // Validate phone number format (if applicable)
      },
    },
    // ... other fields with validation as needed
  });

  // Define relationships (example)
  // User.belongsToMany(Role, { through: 'UserRoles' });
  // Additional fields (consider separate tables or relationships)
  // roles: {
  //   type: Sequelize.ARRAY(Sequelize.STRING),
  // },
  // permissions: {
  //   type: Sequelize.ARRAY(Sequelize.STRING),

  return User;
};
  