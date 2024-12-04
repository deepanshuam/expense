const express = require('express');

const premiumController = require('../controllers/premium');
const router = express.Router();
const authenticate = require('../middleware/auth');

router.get('/showleaderboard', authenticate, premiumController.showLeaderBoard);

// router.get('/download', authenticate, premiumController.downloadExpenses);

router.get('/alldownloadhistory', authenticate, premiumController.getAllDownloadHistory);


module.exports=router;