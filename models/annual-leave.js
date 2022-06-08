const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const annualLeaveSchema = new Schema({
    dateOff: {
        type: Date,
        required: true
    },
    hoursAmount: {
        type: Number,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    staffId: {
        type: Schema.Types.ObjectId,
        ref: 'Staff',
        required: true 
    }
});

module.exports = mongoose.model('AnnualLeave', annualLeaveSchema);