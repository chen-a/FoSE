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

const appointmentModel = sequelize.define("appointment", {
    userId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    doctorId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      doctorInfo: {
        type: DataTypes.STRING,
        allowNull: false
      },
      userInfo: {
        type: DataTypes.STRING,
        allowNull: false
      },
      bedId: {
        type: DataTypes.STRING,
        allowNull: true
      },
      date: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "pending",
      },
      time: {
        type: DataTypes.STRING,
        allowNull: false
      },
      isBillCreated: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
});

sequelize.sync().then(() => {
    console.log('Appointment table created successfully!');
 }).catch((error) => {
    console.error('Unable to create table : ', error);
 });

 
module.exports = appointmentModel;