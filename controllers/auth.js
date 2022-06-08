const bcrypt= require('bcryptjs');

const { validationResult} = require('express-validator');

const Staff= require('../models/staff');

exports.getLogin = (req, res, next)=>{
    let message = req.flash('error');
    if(message.length > 0){
        message= message[0];
    } else {
        message = null
    }
    res.render('auth/login',{
        path:'/login', 
        pageTitle: 'Login',
        errorMessage: message,
        oldInput: {
            email: [],
            password: []
        },
        validationResult: []
    });
};
exports.postLogin= (req, res, next) => {
    const email= req.body.email;
    const password= req.body.password;
    const errors= validationResult(req, res);
   // this is validate email and password
    if(!errors.isEmpty()){
        return res.status(422)
        .render('auth/login',{
            path:'login', 
            pageTitle: 'login', 
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email,
                password: password
            },
            validationResult: errors.array()

        })
      }
   
    Staff.findOne().exec()
    .then(staff=>{
        
         if(staff.manager == email){
            bcrypt.compare(password, staff.password)
            .then(doMatch=>{
                if(doMatch){
                 req.session.isManager = true;
                 req.session.isLoggedIn = true;
                 req.session.staff= staff; 
                 return  req.session.save(err=>{ 
                console.log(err) 
                res.redirect('/') 
            }) 
                }
                return res.status(422).render('auth/login',{
                    path:'/login', 
                    pageTitle: 'Login',
                    errorMessage: 'mật khẩu không chính xác!',
                    oldInput: {
                        email: email,
                        password: password
                    },
                    validationResult:[]
                })
            })
         }
        if(staff.manager!== email && staff.email!== email){
            return res.status(422)
            .render('auth/login',{
                    path: '/login',
                    pageTitle: 'Login',
                    errorMessage: 'Email hoặc mật khẩu không chính xác',
                    oldInput: {
                      email: email,
                      password: password
                    },
                    validationErrors: []
            })
        
        }
        if(staff.email== email){
            bcrypt.compare(password, staff.password)
            .then(doMatch=>{
                if(doMatch){
                 req.session.isLoggedIn = true;
                 req.session.staff= staff; 
                 return  req.session.save(err=>{ 
                console.log(err) 
                res.redirect('/') 
            }) 
                }
                return res.status(422).render('auth/login',{
                    path:'/login', 
                    pageTitle: 'Login',
                    errorMessage: 'mật khẩu không chính xác!',
                    oldInput: {
                        email: email,
                        password: password
                    },
                    validationResult:[]
                })
            })

         }
        // bcrypt.compare(password, staff.password)
        // .then(doMatch=>{
        //     if(doMatch){
        //      req.session.isLoggedIn = true;
        //      req.session.staff= staff; 
        //      return  req.session.save(err=>{ 
        //     console.log(err) 
        //     res.redirect('/') 
        // }) 
        //     }
        //     return res.status(422).render('auth/login',{
        //         path:'/login', 
        //         pageTitle: 'Login',
        //         errorMessage: 'mật khẩu không chính xác!',
        //         oldInput: {
        //             email: email,
        //             password: password
        //         },
        //         validationResult:[]
        //     })
        // })

        // .catch(err=>{ console.log(err)
        // res.redirect('/login')})
       
    })
    .catch(err=> console.log(err))
}

exports.postLogout= (req, res, next) => {
    req.session.destroy(err=>{
         console.log(err)
        res.redirect('/login')
        })
}