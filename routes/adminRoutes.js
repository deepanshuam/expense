const express=require('express');
const {postSignUp,postUserLogin}=require('../controllers/users')

const {downloadExpenses,postUserExpenses, getUserExpense,editUserExpenses,deleteUserExpenses,getAllExpenses}=require('../controllers/expenses');
const userAuthenticate=require('../middleware/auth')

const User=require('../models/user');
const bcrypt=require('bcrypt');
const purchaseController=require('../controllers/purchase');
const premiumController = require('../controllers/premium');

const authenticate = require('../middleware/auth');
const router=express.Router();

router.post('/signup',postSignUp);

router.post('/login',postUserLogin);

router.use(authenticate);

router.post('/expenses',  postUserExpenses);

router.get('/expenses',getAllExpenses);

router.get('/expenses/:id',getUserExpense);

router.delete('/expenses/:id',deleteUserExpenses);

router.put('/expenses/:id',editUserExpenses);

router.get('/premium/premiummembership',authenticate,purchaseController.purchasepremium);

router.post('/premium/updateTransactionStatus',authenticate,purchaseController.updateTransactionStatus);

router.get('/download', authenticate, downloadExpenses);
module.exports=router;