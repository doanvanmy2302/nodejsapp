const Staff = require("../models/staff");
const TimeRecord = require("../models/time-record");
const AnnualLeave = require("../models/annual-leave");

const ITEMS_PER_PAGE = 2;

exports.getSalary = (req, res, next) => {
  const staffId = req.staff._id;
  const page = +req.query.page || 1;
  
  Staff.findById(staffId).then((staff) => {
    TimeRecord.find({ staffId: staffId }).then((result) => {
      // lấy bản ghi có endTime
      let resultHasEndTime = result.filter((item) => {
        return item.endTime;
      });

      // khai báo biến mới lưu trữ bản ghi
      const dateRecords = [{
        "date": '', 
        "annualLeaveofDay": 0, 
        "dayHoursAmount": 0, 
        "timeRecords": []
    }];
      for (let i = 0; i < resultHasEndTime.length; i++) {
        dateRecords.push({
          "date": '', 
          "annualLeaveofDay": 0, 
          "dayHoursAmount": 0, 
          "overTime": 0, 
          'shortTime' : 0, 
          "timeRecords": []
      });
      dateRecords[i].date = resultHasEndTime[i].startTime.toString().slice(4, 15);
        dateRecords[i].timeRecords.push(resultHasEndTime[i]);
       
      }
     dateRecords.pop();

      let dateRecordsDup = dateRecords.map((item1, index1) => {
        let equal = dateRecords.find((item2, index2) => {
          if (index1 > index2) {
            return item1.date == item2.date;
          }
        });
        if (equal) {
          item1.isDuplicate = true;
          return item1;
        } else {
          return item1;
        }
      });
      // khai báo lưu trữ bản ghi ko có isDuplicate
      let dateRecordsResult = [];

      dateRecordsDup.forEach((element, key) => {
        if (!element.isDuplicate) {
          dateRecordsResult.push(element);
        }
      });

      // push bản khi có isDuplicate vào cùng ngày đó
      for (let i = 0; i < dateRecordsResult.length; i++) {
        let tmpObj = [];
        for (let j = 0; j < dateRecordsDup.length; j++) {
          if (
            dateRecordsResult[i].date == dateRecordsDup[j].date &&
            dateRecordsDup[j].isDuplicate == true
          ) {
            tmpObj.push(dateRecordsDup[j].timeRecords[0]);
          }
        }
        for (let m = 0; m < tmpObj.length; m++) {
          dateRecordsResult[i].timeRecords.push(tmpObj[m]);
        }
      }
      // tính tổng giờ làm của 1 ngày
      for (let i = 0; i < dateRecordsResult.length; i++) {
        let totalHoursADay = 0;
        for (let j = 0; j < dateRecordsResult[i].timeRecords.length; j++) {
          totalHoursADay += dateRecordsResult[i].timeRecords[j].hoursAmount;
        }
        dateRecordsResult[i].dayHoursAmount = totalHoursADay;
      }

      AnnualLeave.find({ staffId: req.staff._id })
        .then((result) => {
          for (let i = 0; i < dateRecordsResult.length; i++) {
            for (let j = 0; j < result.length; j++) {
              if (
                dateRecordsResult[i].date ==
                result[j].dateOff.toString().slice(4, 15)
              ) {
                dateRecordsResult[i].annualLeaveofDay = result[j].hoursAmount;
              }
            }
          }
          return dateRecordsResult;
        })
        
        .then((dateRecordsResult) => {
         const totalItems= dateRecordsResult.length
          let salaryMonth = 0;
          let overTimeMonth = 0;
          let shortTimeMonth = 0;
          // khai báo biến lưu trữ lương
          const salaryObj = {
            'salaryMonth': 0,
            'overTimeMonth': 0,
            'shortTimeMonth': 0,
          };

          if (staff.monthSelected) {
            for (let i = 0; i <totalItems ; i++) {
              let overTimeDay = 0;
              let shortTimeDay = 0;
              overTimeDay =
                dateRecordsResult[i].dayHoursAmount + dateRecordsResult[i].annualLeaveofDay >
                8
                  ? dateRecordsResult[i].dayHoursAmount +dateRecordsResult[i].annualLeaveofDay -
                    8
                  : 0;
              shortTimeDay =
                dateRecordsResult[i].dayHoursAmount +dateRecordsResult[i].annualLeaveofDay <
                8
                  ? 8 -
                    dateRecordsResult[i].dayHoursAmount - dateRecordsResult[i].annualLeaveofDay
                  : 0;

              dateRecordsResult[i].overTime = overTimeDay;
              dateRecordsResult[i].shortTime = shortTimeDay;
            }
           
            for (let i = 0; i < dateRecordsResult.length; i++) {
              if (
                staff.monthSelected.toString().slice(4, 7) ==
                  dateRecordsResult[i].date.slice(0, 3)
              ) {
                overTimeMonth += dateRecordsResult[i].overTime;
                shortTimeMonth += dateRecordsResult[i].shortTime;
              }
            }
            // tính lương của 1 tháng
            salaryMonth =
              staff.salaryScale * 3000000 +
              (overTimeMonth - shortTimeMonth) * 200000;

            salaryObj.salaryMonth = salaryMonth;
            salaryObj.overTimeMonth = overTimeMonth;
            salaryObj.shortTimeMonth = shortTimeMonth;
            
          
         
          }

          const pagination = (dateRecordsResult, ITEMS_PER_PAGE, page) => {
            return dateRecordsResult.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
          };
           {
            res.render("staff/salary", {
              staff: staff,
              timeRecords: pagination(dateRecordsResult,ITEMS_PER_PAGE, page),
              salaryObj: salaryObj,
              pageTitle: "Salary",
              path: "/salary",
              currentPage: page,
              hasNextPage: ITEMS_PER_PAGE * page < totalItems,
              hasPreviousPage: page > 1,
              nextPage: page + 1,
              previousPage: page - 1,
              lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
            });
          }
       
      })
        .catch((err) => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);  
        });
    });
  });
};

exports.postMonthSalary = (req, res, next) => {
  const staffId = req.staff._id;
  const monthSelected = req.body.month;
  Staff.findById(staffId)
    .then((staff) => {
      staff.monthSelected = monthSelected;
      return staff.save();
    })
    .then((result) => {
      console.log("Updated selected month!");
      res.redirect("/salary");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);  
    });
};
