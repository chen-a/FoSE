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

const paymentModel = sequelize.define("payment", {
    amount: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.STRING,
        allowNull: false
    },
    billingId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    creditCardNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    creditCardName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    creditCardExpiration: {
        type: DataTypes.STRING,
        allowNull: false
    },
    creditCardCvv: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

sequelize.sync().then(() => {
    console.log('User table created successfully!');
 }).catch((error) => {
    console.error('Unable to create table : ', error);
 });


module.exports = paymentModel;