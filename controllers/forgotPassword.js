const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const sequelize = require("../util/db");

const User = require('../models/user');
const Forgotpassword = require('../models/forgotPassword');
const Sib = require('sib-api-v3-sdk');


const client=Sib.ApiClient.instance;
const apiKey=client.authentications['api-key'];
apiKey.apiKey=process.env.API_KEY;
const tranEmailApi=new Sib.TransactionalEmailsApi();

const SendEmail=async(req,res,link,email)=>{
    const sender={
        email:'indianbadass52@gmail.com'
    }
    const receivers=[{email}];
    const sendEmail=await tranEmailApi.sendTransacEmail({
        sender,
        to:receivers,
        subject:'Password Reset Request',
        htmlContent: `<a href="${link}">Click here</a> to reset your password`,
   
    });
     // Log success or handle success response if needed
     console.log('Email sent successfully:', sendEmail);
    
    return sendEmail;
}


exports.forgotpassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            throw new Error('User does not exist');
        }

        const forgetpasswordrequest = await Forgotpassword.create({
            userId: user.id,
        });
        const uuid = forgetpasswordrequest.id;
        await user.createForgotpassword({ uuid, isActive: true })
        if (user) {
            const link = `http://localhost:3000/password/resestpassword/${uuid}`;
           await SendEmail(req, res, link, email);
           return res.json({ message: 'Email sent successfully', success: true });
       
        } else {
            throw new Error('User doesnt exist')
        }
    } catch (err) {
        console.error(err)
        return res.json({ message: err, success: false });
    }

}



exports.sendForm = async (req, res, next) => {
    const uuid = req.params.id;
    console.log(uuid);
    if (!uuid) {
        throw new Error('UUID is missing');
    }
    const forgetpasswordrequest = await Forgotpassword.findByPk(uuid);
    // if (!forgetpasswordrequest || !forgetpasswordrequest.isActive) {
    //     res.send(`<h1>Password is already reset</h1>`);
    //     return;
    // }

    // Include the axios script directly inside the HTML string
    const htmlContent = `
        <form action="http://localhost:3000/password/resestpassword/${uuid}" method="POST" id="reset-passsword-form" class="form"> 
            <div class="form-group">
                <label for="pass">New Password:</label>
                <input type="password" id="pass" name="pass" autocomplete="new-password" required>
            </div>
            <button type="submit">Reset</button>
        </form>
        <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
        <script>
            document.getElementById("reset-passsword-form").addEventListener("submit", async (e) => {
                e.preventDefault();
                const password = document.getElementById("pass").value;
                try {
                    const response = await axios.post('http://localhost:3000/password/resestpassword/${uuid}', { pass: password });
                    if (response.data.success) {
                        alert(response.data.message);
                    } else {
                        alert("Failed to reset password. Please try again later.");
                    }
                } catch (err) {
                    console.log(err);
                    alert("An error occurred. Please try again later.");
                }
                document.getElementById("pass").value = "";
            });
        </script>
        <style>
            /* CSS styles here */
            body {
                                font-family: sans-serif;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                min-height: 100vh;
                                background-color: #f5f5f5;
                                margin: 0;
                            }
                            
                            /* Container with a neumorphic look */
                            .container {
                                background-color: #fff;
                                padding: 30px;
                                border-radius: 15px;
                                box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1),
                                    0px 8px 20px rgba(0, 0, 0, 0.05);
                                width: 400px;
                                max-width: 50%;
                                margin: 0 auto;
                            }
                            
                            /* Form styling */
                            form {
                                display: flex;
                                flex-direction: column;
                                gap: 15px;
                            }
                            
                            h1 {
                                text-align: center;
                                font-size: 24px;
                                margin-bottom: 20px;
                            }
                            
                            label {
                                font-weight: bold;
                                margin-bottom: 5px;
                            }
                            
                            input[type="password"] {
                                padding: 10px;
                                border: 1px solid #ccc;
                                border-radius: 5px;
                                font-size: 16px;
                                width: 100%;
                            }
                            
                            
                            input[type="password"]:focus {
                                outline: none;
                                border-color: #007bff;
                                box-shadow: 0 0 5px rgba(0, 123, 255, 0.2);
                            }
                            
                            button {
                                background-color: #007bff;
                                color: #fff;
                                padding: 10px 20px;
                                border: none;
                                border-radius: 5px;
                                cursor: pointer;
                                margin-top: 15px;
                            }
                            
                            button:hover {
                                background-color: #0069d9;
                            }
                            
                            @media (min-width: 768px) {
                                .container {
                                    width: 90%;
                                }
                            
                                .form-group {
                                    display: flex;
                                    flex-direction: row;
                                    align-items: center;
                                }
                            
                                label {
                                    width: 200px;
                                    margin-right: 1px;
                                }
                            
                                input[type="password"] {
                                    width: calc(100% - 210px);
                                }
                            }
        </style>
    `;

    res.send(htmlContent);
};


exports.updatePassword = async (req, res, next) => {
    const password = req.body.pass;
    const uuid = req.params.id;
    
    console.log("Received password:", password); // Add console log to check the received password
    console.log("UUID:", uuid);
    console.log("here is data>>>>>>>", password, uuid, req.body);
    if (!uuid) {
        return res.status(400).send("UUID is missing");
    }
    const t = await sequelize.transaction();
    try {
        const forgetpasswordrequest = await Forgotpassword.findOne({
            where: { id: uuid },
            include: [User] // Include the associated user

        });
        
        console.log("Forget password request:", forgetpasswordrequest); // Add console log to check the forgetpasswordrequest

        if (!forgetpasswordrequest || !forgetpasswordrequest.user) {
            throw new Error('Forget password request not found'); // Handle if the request is not found
        }
        forgetpasswordrequest.isActive = false;

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Hashed password:", hashedPassword); 

console.log("forgetpasswordrequest",forgetpasswordrequest)
        // const userId = forgetpasswordrequest.userId;
        // console.log("userid",userId);
        
        
        
        // user.password = hashedPassword;
        // await user.save();
        const user = forgetpasswordrequest.user.dataValues; // Corrected accessing user data
        console.log("userid", user.id);
        
        user.password = hashedPassword;
        await User.update({ password: hashedPassword }, { where: { id: user.id } });
        await forgetpasswordrequest.save();

        await t.commit();
        res.status(200).send({ success: true, message: "Password reset successfully!" });
    } catch (err) {
        await t.rollback();
        console.log(err);
        res.status(403).send({ success: false, message: "Failed to reset password. Please try again later." });
    }
};
