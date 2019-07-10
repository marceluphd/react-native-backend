const mongoose = require("mongoose");

const mongodb_url = "mongodb+srv://vineet30:Vineetmis30!@first-cluster-wlolf.mongodb.net/game_db"

mongoose.connect(mongodb_url, { useNewUrlParser: true });

module.exports = {mongoose};
