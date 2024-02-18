// Decentralized Storage Integration: Choose suitable decentralized storage providers and libraries for integration.
// Metadata Management: Decide how to handle metadata for stored data (e.g., access control, encryption information).
// Join Tables: Implement EventStorage and UserStorage join tables for managing many-to-many relationships.
// Access Control: Implement robust access control mechanisms, especially for decentralized storage providers.
// Customization: Adapt fields, relationships, and storage integration based on your specific requirements and architecture.

const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const Storage = sequelize.define('Storage', {
    // Essential fields
    provider: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    location: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
      // Options: "local", "IPFS", "S3", "other decentralized storage"
    },
    metadata: {
      type: Sequelize.JSON,
      allowNull: true,
    },
  });

  // Relationships (adapt model names as needed)
  Storage.belongsToMany(Event, { through: 'EventStorage' }); // Many-to-many with Event
  Storage.belongsToMany(User, { through: 'UserStorage' }); // Many-to-many with User

  return Storage;
};
