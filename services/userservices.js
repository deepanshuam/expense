const expenses=require('../models/expense');
const FileURL=require('../models/fileurl');
const getExpenses = (req) => {
    const userId = req.user.id;
    return expenses.findAll({
        where: {
            userId: userId
        }
    })
};

const getAllDownloadHistory = (req) => {
    // return req.user.getFileurls();
    const userId = req.user.id;
    return FileURL.findAll({
        where:{
            userId:userId
        }
    })

}

module.exports = { getExpenses, getAllDownloadHistory };