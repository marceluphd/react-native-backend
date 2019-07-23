const mongoose = require('mongoose');
const _ = require('lodash');

var ApplySchema = new mongoose.Schema({
    tournamentId: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        required: true,
        minlength: 5
    },
    appliers: [
        {
            applierId: {
                type: mongoose.Schema.Types.ObjectId,
                trim: true,
                minlength: 5
            },
            appliedDate: {
              type: Date,
              default: Date.now
            }
        }
    ]
});

var Applications = mongoose.model('Applications', ApplySchema);

module.exports = {Applications};
