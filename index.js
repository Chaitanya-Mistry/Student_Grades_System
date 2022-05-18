const express = require('express');
const fileUpload = require("express-fileupload");
// Express session
const ExpressSession = require('express-session');
const path = require('path');
const app = express();

global.loggedInUser = null;
global.loggedInUserType = null;

// Database Connection
require('./models/database_connection');

// Controllers
const userController = require('./controllers/userController');
const createSubject = require('./controllers/subjectController');

// Templating engine " EJS "
const ejs = require('ejs');
const res = require('express/lib/response');
app.set('view engine', 'ejs');

const isUserLoggedIn = require('./middleware/isUserLoggedIn');
const adminAuthentication = require('./middleware/adminAuthentication');
const teacherAuthentication = require('./middleware/teacherAuthentication');
const studentAuthentication = require('./middleware/studentAuthentication');

// Models
const user = require('./models/user');
const subject = require('./models/subject');

// Middlewares
// From where to get static files like CSS,JS etc..
app.use(express.static('public'));
app.use(fileUpload());
// Body Parsing Middleware to make form data available under "req.body" property ..
app.use(express.json());
app.use(express.urlencoded());
//
// Express session middleware
app.use(ExpressSession({
    secret: 'I am a rockstar'
}));

const port = 4000;

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});

app.use('*',(req,res,next)=>{
    loggedInUser = req.session.userId;
    loggedInUserType = req.session.userType;
    next();
});
// GET Request Handlers
app.get('/', async(req, res) => {
    if(req.session.userType == 'Admin'){
        await user.findById(req.session.userId).then((data)=>{
          return res.render('index',{ adminData : data, studentData:null});
        }).catch(error=>console.log(error));
    }
    else if(req.session.userType == 'Teacher'){
        await user.findById(req.session.userId).then((data)=>{
            console.log('Teacher is Found..:',data);
           return res.render('index',{teacherData:data , admminData:null, studentData:null});
        }).catch(error=>console.log(error));
    }
    else if(req.session.userType == 'Student'){
        await user.findById(req.session.userId).then((data)=>{
            console.log('Student is found ..:',data);
            return res.render('index',{adminData:null,studentData : data});
        });
    }
    else{
          // res.sendFile(path.resolve(__dirname,'views/index.ejs'));
          res.render('index',{adminData:null,teacherData:null,studentData:null}); // With the help of ejs now we can use render method which simplify the thing  
    }
});
app.get('/login',isUserLoggedIn ,(req, res) => {
    res.render('login',{error:null});
});
app.get('/signup',isUserLoggedIn ,(req, res) => {
    res.render('sign_up');
});
app.get('/addSubject',adminAuthentication,(req,res)=>{
    res.render('addSubject',{subjectMessage:null});
});
app.get('/addTeacher',adminAuthentication,async(req,res)=>{
    const fetchedSubject = await subject.find({isAssigned:false});
    res.render('addTeacher',{subjects: fetchedSubject});
});
app.get('/addStudent',adminAuthentication,async(req,res)=>{
    const fetchedSubjects = await subject.find({});
    res.render('addStudent',{subjects:fetchedSubjects});
});
app.get('/addGrade',teacherAuthentication,async(req,res)=>{
    const fetchedTeacher = await user.findById(req.session.userId).populate('teaches');
    const teacherTeaches = fetchedTeacher.teaches.title;
    // console.log('add Grade Fetched Teacher:',fetchedTeacher);
    const fetchedStudents = await user.find({usertype:'Student','learning.subjectName':teacherTeaches});
    res.render('addGrade',{teacher:fetchedTeacher,students:fetchedStudents,success:null,error:null});
});
app.get('/myGrades',studentAuthentication,async(req,res)=>{
    const fetchedStudent = await user.findOne({_id:req.session.userId});
    const studentSubjects = fetchedStudent.learning;
    console.log('From my grades',fetchedStudent,studentSubjects);
    res.render('myGrades',{studentData:fetchedStudent,studentLearning:studentSubjects});
});
app.get('/logout',userController.logout);

// POST Request Handlers
app.post('/createSubject',adminAuthentication,createSubject); // Add Subject
app.post('/addTeacher',adminAuthentication,userController.addTeacher); // Add Teacher
app.post('/addStudent',adminAuthentication,userController.addStudent); // Add Student
app.post('/addGrade',teacherAuthentication,userController.addGrade);   // Add Grade
app.post('/processLogin', userController.processLogin); // Login 