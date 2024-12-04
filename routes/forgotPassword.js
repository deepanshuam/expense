const express = require('express');
const router = express.Router();

const forgetPasswordController = require('../controllers/forgotPassword');

router.post('/forgotpassword', forgetPasswordController.forgotpassword)

// /password/resestpassword/:uuid => GET
router.get("/resestpassword/:id", forgetPasswordController.sendForm);

// /password/resestpassword/:uuid => POST
router.post("/resestpassword/:id", forgetPasswordController.updatePassword);

module.exports = router;