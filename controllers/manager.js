const Staff = require("../models/staff");
const TimeRecord = require("../models/time-record");
const AnnualLeave = require("../models/annual-leave");

const ITEMS_PER_PAGE = 3;

exports.getManager = (req, res, next) => {
  const staffId = req.staff._id;
  const page = +req.query.page || 1;
  let totalItems;
  Staff.findById(staffId).then((staff) => {
    TimeRecord.find({ staffId: staffId }).countDocuments()
   // phân trang 
    .then((numRecords) => {
        totalItems = numRecords
        return TimeRecord.find().skip((page-1)*ITEMS_PER_PAGE)
                                .limit(ITEMS_PER_PAGE)
    })
    .then((result)=>{
        let resultHasEndTime = result.filter((item) => {
            return item.endTime;
            
          });
             let t =resultHasEndTime.map((item) => {return item.hoursAmount})
          let totalSalary = 0; 
          for(let a of t){
            totalSalary += a
          }
        console.log(totalSalary)
       
            res.render("manager/manager", {
              staff: staff,
              timeRecords: resultHasEndTime,
            //   salaryObj: salaryObj,
              pageTitle: "manager",
              path: "/manager",
              totalSalary: totalSalary,
              currentPage: page,
              hasNextPage: ITEMS_PER_PAGE * page < totalItems,
              hasPreviousPage: page > 1,
              nextPage: page + 1,
              previousPage: page - 1,
              lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
            });
          })
       
      })
  
}

exports.postManager = (req, res, next) => {
  const staffId = req.staff._id;
  const monthSelected = req.body.month;
  Staff.findById(staffId)
    .then((staff) => {
      staff.monthSelected = monthSelected;
      return staff.save();
    })
    .then((result) => {
      console.log("Updated selected month!");
      res.redirect("/manager");
    })
    .catch((err) => console.log(err));
};
exports.postDeleteRecord = (req, res, next) => {
    const recordId= req.body.recordId;
    TimeRecord.deleteOne({_id: recordId})
    .then(()=>{
     console.log("Deleted record")
     res.redirect('/manager')
    })
    .catch(err => console.log(err))
}