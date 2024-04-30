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

const userModel = sequelize.define("user", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isDoctor: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isNurse: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    notification: {
        type: DataTypes.JSON
    },
    seenNotification: {
        type: DataTypes.JSON    
    }, 
    insurCompany: {
        type: DataTypes.STRING
    },
    policyNum:{
        type: DataTypes.NUMBER
    }

});

sequelize.sync().then(() => {
    console.log('User table created successfully!');
 }).catch((error) => {
    console.error('Unable to create table : ', error);
 });


module.exports = userModel;