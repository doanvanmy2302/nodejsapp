const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const staffSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    doB: {
        type: Date,
        required: true
    },
    salaryScale: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    imageUrl : {
        type: String,
        required: true
    },
    annualleave: {
        type: Number,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    manager:{
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    timeRecord: {
        items: [
            { 
                timeRecordId: { type: Schema.Types.ObjectId, ref: 'TimeRecord', required: true }
            }
        ]
    },
    annualLeaveRecord: {
        items: [
            { 
                annualLeaveRecordId: { type: Schema.Types.ObjectId, ref: 'AnnualLeave', required: true }
            }
        ]
    },
    monthSelected: {
        type: Date,
        required: false
    },
    covidTestResult: {
        type: Boolean,
        required: false
    }
});

staffSchema.methods.addTimeRecord = function(timeRecord) {
   const updatedTimeRecordItems = [...this.timeRecord.items];
   updatedTimeRecordItems.push({ timeRecordId: timeRecord._id});
   const updatedTimeRecord = { items: updatedTimeRecordItems};
   this.timeRecord = updatedTimeRecord;
   return this.save();
}

staffSchema.methods.addAnnualLeaveRecord = function(annualleave) {
    const updatedAnnualLeaveRecordItems = [...this.annualLeaveRecord.items];
    updatedAnnualLeaveRecordItems.push({ annualLeaveRecordId: annualleave._id});
    const updatedAnnualLeaveRecord = { items: updatedAnnualLeaveRecordItems};
    this.annualLeaveRecord = updatedAnnualLeaveRecord;
    return this.save();
 }

module.exports = mongoose.model('Staff', staffSchema);

