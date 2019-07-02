const mongoose = require("mongoose");

const mongodb_url = "mongodb+srv://faadujs:Faadujs30@testcluster-axown.mongodb.net/test?retryWrites=true&w=majority";

mongoose.connect(mongodb_url, {useNewUrlParser: true});

module.exports = {mongoose};
