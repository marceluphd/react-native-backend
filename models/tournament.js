const mongoose = require("mongoose");
const _ = require("lodash");

const Schema = mongoose.Schema;

const TournamentSchema = new Schema({
    tournamentCategory: {
      type: String,
      trim: true,
      required: true,
      minlength: 4
    },
    tournamentName: {
      type: String,
      trim: true,
      required: true,
      minlength: 4
    },
    tournamentImage: {
      type: String,
      trim: true,
      required: true,
      minlength: 4
    },
    tournamentDesc: {
      type: String,
      trim: true,
      required: true,
      minlength: 4
    },
    prizePool: {
      type: String,
      trim: true,
      required: true,
      minlength: 4
    },
    gameName: {
      type: String,
      trim: true,
      required: true,
      minlength: 4
    },
    noOfPlayers: {
      type: String,
      trim: true,
      required: true,
      minlength: 1
    },
    rules: {
      type: String,
      trim: true,
      required: true,
      minlength: 4
    },
    termsAndConditions: {
      type: String,
      trim: true,
      required: true,
      minlength: 4
    },
    status: {
      type: String,
      trim: true,
      required: true,
      minlength: 4,
      enum: ["ongoing", "closed", "upcoming"]
    },
    tournamentDate: {
      type: Date,
      trim: true,
      required: true
    },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Applications'
    }
});

const Tournament = mongoose.model('TournamentDB', TournamentSchema);

module.exports = {Tournament};
