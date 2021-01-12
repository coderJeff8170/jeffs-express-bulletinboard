/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    UserId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
          },
          FirstName: DataTypes.STRING,
          LastName: DataTypes.STRING,
          Username: { 
            type: DataTypes.STRING,
            unique: true
          },
          Password: DataTypes.STRING,
          Email: { 
            type: DataTypes.STRING,
            unique: true
          },
          Admin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
          },
          Deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
          }
  }, {
    tableName: 'users'
  });
};

// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class users extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//       users.hasMany(models.posts, { 
//         foreignKey: 'UserId', 
//         //as: 'posts' 
//       });
//     }
//   };
//   users.init({
//     UserId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       autoIncrement: true,
//       primaryKey: true,
//       references: {
//         model: 'posts',
//         key: 'UserId'
//       }
//     },
//     FirstName: DataTypes.STRING,
//     LastName: DataTypes.STRING,
//     Username: { 
//       type: DataTypes.STRING,
//       unique: true
//     },
//     Password: DataTypes.STRING,
//     Email: { 
//       type: DataTypes.STRING,
//       unique: true
//     },
//     Admin: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: false
//     },
//     Deleted: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: false
//     }
//   }, {
//     sequelize,
//     modelName: 'users',
//   });
//   return users;
// };