const path = require('path');

const Staff = require('./models/staff');
const authRoutes= require('./routes/auth');
const staffRoutes = require('./routes/staff');
const managerRoutes = require('./routes/manager');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoBDStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const multer = require('multer');

const errorController = require('./controllers/error');

const MONGODB_URI = 'mongodb+srv://mydoan:doanvanmy2302@cluster0.ajlp6.mongodb.net/Staff'

const app = express();
const store = new MongoBDStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

const fileStorage = multer.diskStorage({
    destination: (req,file, cb)=>{
        cb(null, 'images')
    },
    filename: (req, file, cb)=>{
        cb(null, Math.random().toFixed(4) + '-'+ file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' || 
        file.mimetype === 'image/jpg' || 
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

app.set('view engine', 'ejs');
app.set('views', 'views');



app.use(bodyParser.urlencoded({extended: false}));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(session({secret: 'my secret', resave: false, saveUninitialized: false, store: store}));
// bien 
app.use((req, res, next)=>{
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.isManager = req.session.isManager;
    next();
});
app.use(flash());

app.use((req, res, next) => {
    if(!req.session.staff){
        return next();
    }
    Staff.findById(req.session.staff._id)
        .then(staff => {
            if(!staff){
                return next();
            }
            req.staff = staff;
            next();
        })
        .catch(err => console.log(err));
});

app.use(staffRoutes);
app.use(authRoutes);
app.use(managerRoutes);
app.get('/500', errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next)=>{
    console.error(error);
    res.render(500).render('500',{
        pageTitle: 'Error',
        isAuthenticated:req.session.isLoggedIn
    })
})

mongoose
    .connect(MONGODB_URI)
    .then(result => {
        app.listen(process.env.PORT || 3001, "0.0.0.0", () => {
            console.log("Server is running.");
          });
    })
    .catch( err => {
        console.log(err);
    });
