const Sequelize=require('sequelize');

const sequelize=new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD,{
host:process.env.HOST_NAME,
port: process.env.DB_PORT ,
dialect:"mysql"
})

module.exports=sequelize;

