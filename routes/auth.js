const express = require('express');

const {body} = require('express-validator');

const authController = require('../controllers/auth');

const router= express.Router();

router.get('/login', authController.getLogin);

router.post('/login',[
    body('email')
    .isEmail()
    .withMessage('email không hợp lệ'), 
    body('password', 'Mật khẩu chứa ít nhất 5 kí tự')
    .isLength({min: 5})
    .isAlphanumeric()
    .trim()
], authController.postLogin);

router.post('/logout', authController.postLogout);

module.exports= router;