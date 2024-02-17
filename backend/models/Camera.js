// Adapt this model to your specific database setup and authentication strategies.
// Define relationships with other tables as needed.
// Implement access control logic based on user roles and permissions.
// Encrypt sensitive data at rest and in transit.
// Regularly update security libraries and dependencie

const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const Camera = sequelize.define('Camera', {
    // Essential fields
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: Sequelize.STRING,
    },
    ipAddress: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    port: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    username: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
      set(value) {
        this.setDataValue('password', bcrypt.hashSync(value, 10)); // Hash password
      },
    },
    isActive: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    // Additional fields
    model: {
      type: Sequelize.STRING,
    },
    brand: {
      type: Sequelize.STRING,
    },
    location: {
      type: Sequelize.STRING,
    },
    streamUrl: {
      type: Sequelize.STRING,
    },
    recordingEnabled: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    storageLocation: {
      type: Sequelize.STRING,
    },
    retentionPeriod: {
      type: Sequelize.INTEGER,
    },
    resolution: {
      type: Sequelize.STRING,
    },
    fps: {
      type: Sequelize.INTEGER,
    },
    sensors: {
      type: Sequelize.ARRAY(Sequelize.STRING),
    },
    permissions: {
      type: Sequelize.ARRAY(Sequelize.STRING), // Consider separate table for permissions
    },
  });

  // Define relationships (examples)
  // Camera.belongsToMany(User, { through: 'CameraPermissions' });
  // Camera.hasMany(Event);
  // Camera.belongsTo(Storage);

  return Camera;
};
