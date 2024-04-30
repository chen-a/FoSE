const Sequelize = require("sequelize");
// const sequelize = new Sequelize(
//  'test',
//  'root',
//  'Annie122998',
//   {
//     host: 'localhost',
//     dialect: 'mysql'
//   }
// );
const sequelize = new Sequelize(

  'test_db',
 
  'root',
 
  'password',//'S@jj@7799',
 
   {
 
     host: 'localhost',
 
     dialect: 'mysql'
 
   }
 
 );
 
// sequelize.authenticate().then(() => {
//     console.log('Connection has been established successfully.');
//  }).catch((error) => {
//     console.error('Unable to connect to the database: ', error);
//  });

 const connectDB = async () => {
  sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
 }).catch((error) => {
    console.error('Unable to connect to the database: ', error);
 });
};

module.exports = connectDB;