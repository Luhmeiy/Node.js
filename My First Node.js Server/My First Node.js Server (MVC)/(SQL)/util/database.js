const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'Nodecomplete', {
    dialect: 'mysql', 
    host: 'localhost'
});

module.exports = sequelize;