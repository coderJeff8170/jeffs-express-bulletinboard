//describes the relationship between each user and their many posts:
//To create a One-To-Many relationship, the hasMany and belongsTo associations are used together;
//https://sequelize.org/master/manual/assocs.html

module.exports = function(models) {
    models.posts.belongsTo(models.users,{ foreignKey: 'UserId'});
    models.users.hasMany(models.posts,{ foreignKey: 'UserId' });
}

// module.exports = function(models) {
//     models.users.hasMany(models.posts, 
//         { 
//             //this is the column inside Users that is used inside posts as a foreign key
//             foreignKey: 'UserId'
//         });
//     models.posts.belongsTo(models.users,
            // {
            //     foreignKey: 'UserId'
            // });
// }

//after describing the relationship, you must import to models/index.js, and then call that import
//between Object.keys(db) and db.sequelize at the bottom of the file.


