const express = require("express");
const app = express();
const bodyParser = require('body-parser');

const {mongoose} = require("./db/db");
const userController = require("./controllers/userController");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/user", userController);

const port = process.env.PORT || 3333;

app.listen(port, () => {
    console.log("Server is running on port 3333");
});
