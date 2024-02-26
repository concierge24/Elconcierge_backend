const Sequelize = require('sequelize');

module.exports = {
  // `query` was passed in the `index.js` file
  up: async (query) => {
    // return Promise.all([ query.addColumn(
    //       'user',
    //       'license_number',
    //     Sequelize.STRING
    //     ),
    //     query.addColumn(
    //       'user',
    //       'license_images',
    //     Sequelize.STRING
    //     ),
    //   ]);
},
  down: async (query) => {
    // return Promise.all([
    //   queryInterface.removeColumn('user', 'license_number'),
    //   queryInterface.removeColumn('user', 'license_images')
    // ]);
  }
}