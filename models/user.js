const Sequelize=require('sequelize');
const sequelize=require('../util/db')
const bcrypt=require('bcrypt');
const expenses=require('./expense')
const Forgotpassword=require('./forgotPassword')
const User=sequelize.define('users',{
    id:{
        type : Sequelize.INTEGER,
        allowNull : false,
        primaryKey : true,
        autoIncrement : true
    },
    name:{
        type : Sequelize.STRING,
        allowNull : false
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    password:{
        type:Sequelize.STRING,

    },
    ispremiumuser: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
    totalExpense:{
        type: Sequelize.INTEGER,
        defaultValue: 0, 
    }
    
});
User.prototype.createForgotpassword = async function({ isActive }) {
    try {
        const forgotPassword = await Forgotpassword.create({
            userId: this.id,
        
            isActive: isActive
        });
        return forgotPassword;
    } catch (error) {
        throw new Error(error);
    }
}


User.hasMany(expenses,{foreignKey:'userId'});

module.exports=User;