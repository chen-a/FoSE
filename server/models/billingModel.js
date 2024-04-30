const { Sequelize, DataTypes } = require("sequelize");
const db = require('../config/db');
/*const sequelize = new Sequelize(
 'test',
 'root',
 'Annie122998',
  {
    host: 'localhost',
    dialect: 'mysql'
  }
);*/
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

 const billingModel = sequelize.define("bills", {
    userId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    amount: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.STRING,
        allowNull: false
    },
    appointmentId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    doctorInfo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    amount: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isPaid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
});

sequelize.sync().then(() => {
    console.log('User table created successfully!');
 }).catch((error) => {
    console.error('Unable to create table : ', error);
 });


module.exports = billingModel;