const { Sequelize, DataTypes } = require("sequelize");
// const db = require('../config/db');
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
 
sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
 }).catch((error) => {
    console.error('Unable to connect to the database: ', error);
 });

const doctorModel = sequelize.define("doctor", {
    userId: {
        type: DataTypes.STRING
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true
      },
      website: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true
      },
      specialization: {
        type: DataTypes.STRING,
        allowNull: true
      },
      experience: {
        type: DataTypes.STRING,
        allowNull: true
      },
      feesPerCunsaltation: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'pending'
      },
      startTime: {
        type: DataTypes.STRING,
        allowNull: true
      },
      endTime: {
        type: DataTypes.STRING,
        allowNull: true
      },
});

sequelize.sync().then(() => {
    console.log('Doctor table created successfully!');
 }).catch((error) => {
    console.error('Unable to create table : ', error);
 });

module.exports = doctorModel;