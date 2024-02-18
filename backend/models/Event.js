// Event Types: Define clear and meaningful event types based on your system's functionality.
// Footage Storage: Determine how and where video footage will be stored and linked to events.
// Metadata Management: Decide how to handle additional event data (e.g., JSON format in the metadata field).
// Join Tables: Implement the UserEvent join table if needed for the many-to-many relationship with users.
// Customization: Adapt fields, relationships, and data handling based on your specific requirements.

const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const Event = sequelize.define('Event', {
    // Essential fields
    timestamp: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    cameraId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Camera', // Adapt model name if needed
        key: 'id',
      },
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    // Add more fields as needed (e.g., footageURL, metadata, severity)
  });

  // Relationships (adapt model names as needed)
  Event.belongsTo(Camera); // One event belongs to one camera
  Event.belongsToMany(User, { through: 'UserEvent' }); // Many-to-many with User
  Event.belongsTo(Search); // Optional, if events are associated with searches

  return Event;
};
