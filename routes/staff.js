const express = require('express');

const isAuth= require('../middleware/is-auth');

const staffController = require('../controllers/staff');
const annualLeaveController = require('../controllers/annualleave');
const salaryController = require('../controllers/salary');
const covidController = require('../controllers/covid')

const router = express.Router();

router.get('/', staffController.getIndex);

router.get('/timekeeping',isAuth, staffController.getTimeKeeping);

router.get('/staff-info',isAuth, staffController.getStaff);

router.post('/edit-staff-image',isAuth, staffController.postEditStaffImage);

router.post('/start-working',isAuth, staffController.postStartWorking);

router.post('/end-working',isAuth, staffController.postEndWorking);

router.post('/annual-leave',isAuth, annualLeaveController.postAnnualLeave);

router.get('/salary',isAuth, salaryController.getSalary);

router.post('/month-salary',isAuth, salaryController.postMonthSalary);

router.get('/covid',isAuth, covidController.getCovid);

router.post('/covid/body-temperature',isAuth, covidController.postBodyTemp);

router.post('/covid/vaccine',isAuth, covidController.postVaccine);

router.post('/covid/test-result',isAuth, covidController.postTestResult);

router.get('/covid/:staffId', isAuth, covidController.getPDF);

module.exports = router;