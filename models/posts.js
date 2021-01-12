/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('posts', {
    PostId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
          },
          PostTitle: DataTypes.STRING,
          PostBody: DataTypes.STRING,
          UserId: {
            type: DataTypes.INTEGER,
            references: {
              model: 'users',
              key: 'UserId'
            }
          },
          Deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
          }
  }, {
    tableName: 'posts'
  });
};


// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class posts extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      * make sure this has user id with ref. Users should NOT have refs.
//      */
//     static associate(models) {
//       // define association here
//       posts.belongsTo(models.users, { 
//         foreignKey: 'UserId', 
//         //as: 'users'
//       });
      
//     }
//   };
//   posts.init({
//     PostId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       autoIncrement: true,
//       primaryKey: true
//     },
//     PostTitle: DataTypes.STRING,
//     PostBody: DataTypes.STRING,
    
//     Deleted: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: false
//     }
//   }, {
//     sequelize,
//     modelName: 'posts',
//   });
//   return posts;
// };