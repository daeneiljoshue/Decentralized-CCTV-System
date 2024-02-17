// Adapt this code to your specific project structure and requirements.
// Consider performance optimization techniques for large datasets or complex queries.
// Explore additional features like stemming or language support if needed.
// Thoroughly test your search functionality to ensure accuracy and user experience.



const Sequelize = require('sequelize');
const { Op } = Sequelize; // Import operators for advanced filtering

module.exports = (sequelize) => {
  const Search = sequelize.define('Search', {
    // Essential fields
    searchQuery: {
      type: Sequelize.STRING,
      allowNull: false,
      // Add full-text index for MySQL:
      index: Sequelize.FULLTEXT,
    },
    timestamp: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: true, // Optional depending on privacy requirements
    },
    searchResults: {
      type: Sequelize.JSON,
      allowNull: false,
    },
    metadata: {
      type: Sequelize.JSON,
      allowNull: false,
    },
    // Optional fields
    userPreferences: {
      type: Sequelize.JSON,
      allowNull: true,
    },
  });

  // One-to-Many relationships (adapt model names and association options)
  Search.hasMany(Event, { onDelete: 'CASCADE' }); // Many Events can belong to one Search
  Search.hasMany(Camera, { onDelete: 'CASCADE' }); // Many Cameras can be in one Search result
  // Add more relationships as needed for other models

  // Optional One-to-Many with User (for user-specific preferences)
  if (userId) {
    Search.belongsTo(User); // One Search belongs to one User
  }

  // Access control and privacy (implement based on your requirements)
  Search.prototype.canAccess = function (user) {
    // Check if search is user-specific and belongs to the current user
    if (this.userId && this.userId !== user.id) {
      return false; // Deny access to non-owner searches
    }

    // Implement role-based access control logic here
    // (e.g., check user roles and permissions against search results)

    return true; // Allow access by default
  };

  // Enhanced search method (integrate into your application logic)
  Search.prototype.search = async function (query, filters = {}, sort = {}, limit = 10, offset = 0) {
    // Build WHERE clause (consider date ranges, string comparisons, numeric intervals)
    const whereClause = {
      // ... conditions based on filters
    };

    // Use MATCH() for relevance scoring and partial matches
    const scoredResults = await sequelize.query(
      // Construct your SQL query with MATCH(), WHERE, ORDER BY, LIMIT, OFFSET
      `SELECT *, MATCH(searchQuery) AGAINST (:query) AS score
       FROM Searches
       WHERE ${whereClause}
       ORDER BY ${sort.field} ${sort.order}
       LIMIT ${limit} OFFSET ${offset}`
    );

    const Sequelize = require('sequelize');
const { Op } = Sequelize; // Import operators for advanced filtering

module.exports = (sequelize) => {
  // ... (rest of the Search model definition)

  // Custom highlighting function for plain text
  function highlightMatchingTerms(text, queryTerms) {
    const regex = new RegExp(`(${queryTerms.join('|')})`, 'gi'); // Case-insensitive
    return text.replace(regex, '<b style="background-color: black;">$1</b>');
  }

  // Enhanced search method (continued)
  // ...

    highlightedResults.push({
      // ... other result fields
      searchResults: highlightedText,
      // ...
    });
  }

  return highlightedResults;
};
};

  // Define relationships (examples)
  // Search.belongsTo(User); // Optional, for user-specific preferences
  // Search.hasMany(Event); // Example for connecting to other models
  // Search.hasMany(Camera); // Example for connecting to other models
