const Expense = require("../models/expense");//expenses
const Users = require("../models/user");//User users
const sequelize = require("../util/db");
const UserServices = require("../services/userservices");
// const S3services = require("../services/s3services");
const jwt = require("jsonwebtoken");
const expensesController=require('./expenses');





exports.getAllDownloadHistory = async (req, res) => {
    try {
        const downloadHistory = await UserServices.getAllDownloadHistory(req);
        console.log("downlaod historet",downloadHistory);
        res.status(200).json({ downloadHistory, success: true });
    } catch (error) {
        res.status(500).json({ message: error, success: false });
    }
};

exports.showLeaderBoard = async (req, res) => {
    try {
        console.log("in leaderboard");
        const leaderBoardOfUsers = await Users.findAll({
            // attributes: ["id", "name", [sequelize.fn('sum', sequelize.col('expense.amount')), "totalExpense"]],
            // include: [
            //     {
            //         model: Expense,
            //         attributes: []
            //     }
            // ],
            // group: ['user.id'],
            order: [["totalExpense", "DESC"]],
        });
        console.log("data manipulation")
        res.status(200).json(leaderBoardOfUsers);
    } catch (error) {
        res.status(403).json({ error: error });
        console.log(error);
    }
};