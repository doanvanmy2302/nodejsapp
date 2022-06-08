const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bodyTempSchema = new Schema ({
    temperature: {
        type: Number,
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    staffId: {
        type: Schema.Types.ObjectId,
        ref: 'Staff',
        required: true 
    }
})

module.exports = mongoose.model('BodyTemp', bodyTempSchema);
