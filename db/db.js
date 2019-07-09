const mongoose = require("mongoose");

const mongodb_url = "mongodb://vineet30:Buntymis30!@ds141889.mlab.com:41889/modulegenerator";

mongoose.connect(mongodb_url, {useNewUrlParser: true});

module.exports = {mongoose};
