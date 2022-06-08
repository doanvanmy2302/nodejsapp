const BodyTemp = require('../models/body-temperature');
const Vaccine = require('../models/vaccine');
const Staff = require('../models/staff');

const PDFDocument = require('pdfkit');
exports.postBodyTemp = (req, res, next) => {
    const temperature = req.body.bodytemp;
    const staffId = req.staff._id;
    const today = new Date();
    const bodytemp = new BodyTemp({
        temperature: temperature,
        time: today,
        staffId: staffId
    })
    bodytemp
        .save()
        .then(result => {
            console.log('Posted body temperature success!');
            res.redirect('/covid')
        })
        .catch((err) =>{
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);  
        }
         )
}

exports.postVaccine = (req, res, next) => {
    const numberVaccine = req.body.numberVaccine;
    const type = req.body.vaccine_type;
    const date = req.body.vaccine_date;
    const staffId = req.staff._id;
  
    const vaccine = new Vaccine({
        numberVaccine: numberVaccine,
        type: type,
        date: date,
        staffId: staffId
    })
    vaccine
        .save()
        .then(result => {
            console.log('Posted vaccince success!');
            res.redirect('/covid')
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);  
          })
}

exports.postTestResult = (req, res, next) => {
    const result = req.body.test_result;
    const staffId = req.staff._id;
  
    Staff.findById(staffId)
        .then(staff => {
            staff.covidTestResult = result;
            return staff.save()
        })
        .then(result => {
            console.log('Updated covid test result!');
            res.redirect('/covid')
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);  
          })
}

exports.getCovid = (req, res, next) => {
    Staff.findById(req.staff._id)
    .then((staff)=>{
        BodyTemp.find({staffId:req.staff._id}).then((bodyTemp)=>{
            Vaccine.find({staffId:req.staff._id}).then((vaccine)=>{
        res.render('covid/covid', {
            pageTitle: 'Covid',
            path: '/covid',
            staff: staff,
            bodyTemp: bodyTemp[bodyTemp.length - 1],
            vaccine: vaccine[0]
          });
        })
    })
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);  
      })
}
exports.getPDF = (req, res, next) => {
    Staff.findById(req.params.staffId)
    .then((staff)=>{
        BodyTemp.find({staffId:req.params.staffId}).then((bodyTemp)=>{
       Vaccine.find({staffId:req.params.staffId}).then((vaccine)=>{
       const d= staff.covidTestResult == true ? 'positive': 'negative';
        const pdfDoc = new PDFDocument();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline');

        pdfDoc.pipe(res)
        pdfDoc.fontSize(27).text("THÔNG TIN COVID NHÂN VIÊN ");
        pdfDoc.text('------------------------------------------');

        pdfDoc.fontSize(20).text('FullName : '+ staff.name);


        pdfDoc.text('Body temperature : '+ bodyTemp[0].temperature+'  --  '+bodyTemp[0].time.toString().slice(0,15));
        pdfDoc.text('NumberVaccine  : '+vaccine[0].numberVaccine );
        pdfDoc.text('Vaccine type  : '+vaccine[0].type );
        pdfDoc.text('Vaccination day :  '+ vaccine[0].date.toString().slice(0,15))
        
        pdfDoc.text('test covid result : '+ d);
        pdfDoc.text('-----------------------------------------')
        pdfDoc.end();
         })
       })  
    })
    .catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);  
      })
}

