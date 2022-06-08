const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const timeRecordSchema = new Schema ({
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: false
    },
    location: {
        type: String,
        required: true
    },
    hoursAmount: {
        type: Number,
    
    },
    staffId: {
        type: Schema.Types.ObjectId,
        ref: 'Staff',
        required: true 
    }
})

module.exports = mongoose.model('TimeRecord', timeRecordSchema);
