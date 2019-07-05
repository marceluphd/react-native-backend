const mongoose = require("mongoose");

const mongodb_url = <MLAB_URL>;

mongoose.connect(mongodb_url, {useNewUrlParser: true});

module.exports = {mongoose};
