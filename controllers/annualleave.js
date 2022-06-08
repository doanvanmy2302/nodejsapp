const AnnualLeave = require('../models/annual-leave');

const Staff = require('../models/staff')

exports.postAnnualLeave = (req, res, next) => {

    const staffId = req.staff._id;
    const dateOff = req.body.dateOff;
    const reason = req.body.reason;
    const hoursAmount = req.body.hoursAmount;

    const annualLeave = new AnnualLeave({
        dateOff: dateOff,
        reason: reason,
        hoursAmount: hoursAmount,
        staffId: staffId
    })

    annualLeave
        .save()
        .then(result => {
            console.log('Post annualLeave success!');

            Staff.findById(result.staffId)
                .then(staff => {
                    staff.annualleave = staff.annualleave - hoursAmount/8;
                    return staff.save();
                })
                .then( staff => {
                    console.log('Updated Annual Leave');
                    return staff.addAnnualLeaveRecord(annualLeave);
                })
                .then(result => res.redirect('/'))
        })
        .catch(err => console.log(err))   
 }