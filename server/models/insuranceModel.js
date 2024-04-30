const { Sequelize, DataTypes } = require("sequelize");
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
   `password`,//'S@jj@7799',
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

const insuranceModel = sequelize.define("insurance", {
    companyName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    amtCovered: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
});

sequelize.sync().then(() => {
    console.log('Insurance table created successfully!');
 }).catch((error) => {
    console.error('Unable to create table : ', error);
 });

 
module.exports = insuranceModel;