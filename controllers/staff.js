
const Staff = require('../models/staff');

const TimeRecord = require('../models/time-record');

exports.getIndex = (req, res, next) => {
  res.render('staff/index', {
    path: '/',
    pageTitle: 'trang chu'
  })
}

exports.getStaff = (req, res, next) => {
  const staffId = req.staff._id;
  Staff.findById(staffId)
    .then((staff) => {
      res.render('staff/staff-info', {
        staff: staff,
        pageTitle: 'thong tin nhan vien',
        path: '/staff-info'
      })
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);  
    })
}

exports.postEditStaffImage = (req, res, next) => {
  const staffId = req.staff._id;
  const image = req.file;
 console.log(image)
 const imageUrl = image.path;
  Staff.findById(staffId)
    .then(staff => {
      staff.imageUrl = imageUrl;
      return staff.save()
    })
    .then(result => {
      res.redirect('/staff-info')
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);  
    })
}
exports.getTimeKeeping = (req, res, next) => {
  const staffId = req.staff._id;
  Staff.findById(staffId)
    .then(staff => {
      staff.populate('timeRecord.items.timeRecordId')
        .then(result => {

          return result.timeRecord.items;
        })
        .then(result => {
          var today = new Date();
          // khai bao bien nhung ban ghi cua ngay hom nay
        let Records = [];
        result.forEach((element, key) => {
          if (element.timeRecordId !==null ) {
            Records.push(element);
          }
        });
        // lấy bản ghi của ngày hôm nay 
          var timeRecordToday = Records.filter(item => {
            return item.timeRecordId.endTime
          }).filter(item => {
            return item.timeRecordId.startTime.getDate() === today.getDate() &&
              item.timeRecordId.startTime.getMonth() === today.getMonth() &&
              item.timeRecordId.startTime.getFullYear() === today.getFullYear()
          })
        
          let recordHours = timeRecordToday.map(item => {
            return (item.timeRecordId.endTime - item.timeRecordId.startTime) / 3600000
          })
          let hoursTotalToday = 0;
          for (let i = 0; i < recordHours.length; i++) {
            hoursTotalToday = hoursTotalToday + recordHours[i]
          }
          // lấy bản ghi của hôm nay nhưng ko có endTime
          let timeRecordTodayNotEndTime = Records.filter(item => {
            return item.timeRecordId.startTime
          }).filter(item => {
            return !item.timeRecordId.endTime
          })[0];
          staff.populate('annualLeaveRecord.items.annualLeaveRecordId')
            .then(annualleave => {
              res.render('staff/timekeeping', {
                staff: staff,
                annualleave: annualleave.annualLeaveRecord.items,
                timeRecordToday: timeRecordToday,
                timeRecordTodayNotEndTime: timeRecordTodayNotEndTime,
                hoursTotalToday: hoursTotalToday,
                pageTitle: 'cham cong',
                path: '/timekeeping'
              })
            })
            .catch(err => { console.log(err) })
        })
    })
    .catch(err =>{
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);  
    })
}
exports.postStartWorking= (req, res, next) => {
  const staffId= req.staff._id;
  const location= req.body.location;
  const startTime= new Date();
  
  const timeRecord= new TimeRecord({
    startTime: startTime,
    endTime: null,
    location: location,
    staffId: staffId,
    hoursAmount:0
  })
  timeRecord.save();
  Staff.findById(staffId).then(staff=>{
    return staff.addTimeRecord(timeRecord)
  })
  .then(result=>{
    console.log('add record success')
    res.redirect('/timekeeping')
  })
  .catch(err=>{
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);  
  })
}
exports.postEndWorking= (req, res, next) => {
  const timeRecordId= req.body.timeRecordId;
  const timeEnding= new Date();

  TimeRecord.findById(timeRecordId)
  .then(result=>{
    result.endTime= timeEnding;
    result.hoursAmount= (timeEnding- result.startTime)/3600000;
    return result.save()
  })
 .then(result=>{
   console.log('post endTime')
   res.redirect('/timekeeping')
 })
 .catch(err =>{
  const error = new Error(err);
  error.httpStatusCode = 500;
  return next(error);  
})
}