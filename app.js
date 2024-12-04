const express = require("express");
const app = express();
require("dotenv").config();

const path = require("path");
const cors = require("cors");
const fs = require("fs");
const session = require("express-session");

const sequelize = require("./util/db");
const User = require("./models/user");
const Expense = require("./models/expense");
const adminRoutes = require("./routes/adminRoutes");
const premiumRoutes = require("./routes/premium");
const Order = require("./models/orders");
const forgotPasswordRoutes = require("./routes/forgotPassword");
const FileURL = require("./models/fileurl");

const Forgotpassword = require("./models/forgotPassword");
const helmet = require("helmet");
const compression = require("compression");
// const morgan=require('morgan');

app.use(cors());
app.use(express.static("./public"));
// console.log("in app.js")

app.use(express.json());
app.use("/users", adminRoutes);
app.use("/premium", premiumRoutes);
app.use("/password", forgotPasswordRoutes);

// const accessLogStream=fs.createWriteStream(
//     path.join(__dirname,'access.log'),
//     {flags:'a'}
// );

app.use(helmet());
app.use(compression());
// app.use(morgan('combined',{stream:accessLogStream}));

User.hasMany(Expense, { foreignKey: "userId" });
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);
Forgotpassword.belongsTo(User, { foreignKey: "userId" });

User.hasMany(FileURL);
FileURL.belongsTo(User);

sequelize
  .sync()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server started on port 3000");
    });
  })
  .catch((e) => console.log(e));

// sequelize
// .sync()
// // .sync({force : true})
// .then(()=>{

// }).catch(e => console.log(e))
