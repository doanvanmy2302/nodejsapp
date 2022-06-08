const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const vaccineSchema = new Schema ({
    numberVaccine: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    staffId: {
        type: Schema.Types.ObjectId,
        ref: 'Staff',
        required: true 
    }
})

module.exports = mongoose.model('Vaccine', vaccineSchema);
