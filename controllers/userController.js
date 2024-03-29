const user = require('../models/user');
const subject = require('../models/subject');
const bcrypt = require('bcrypt');
const path = require('path');
const { compareSync } = require('bcrypt');
const { findOneAndUpdate } = require('../models/user');
// Login 
const processLogin = async(req, res) => {
    const uname = req.body.uname;
    const upassword = req.body.upassword;
    console.log('User entered input: ',uname,upassword);
    const userData = await user.findOne({ username:uname });
    if(userData){
        // console.log('User found is :',userData);
        bcrypt.compare(upassword,userData.password,(error,match)=>{
            if(match){
                console.log('matched');
                // If user is an admin
                if(userData.usertype == 'Admin'){
                    req.session.userId = userData._id;
                    req.session.userType = userData.usertype;
                    return res.redirect('/');
                }
                // If user is a teacher
                else if(userData.usertype == 'Teacher'){
                    req.session.userId = userData._id;
                    req.session.userType = userData.usertype;
                    console.log('Yes logged in user is :Teacher');
                    res.redirect('/addGrade');
                }
                // If user is a student
                else if(userData.usertype == 'Student'){
                    req.session.userId = userData._id;
                    req.session.userType = userData.usertype;
                    console.log('Yes logged in user is :Student');
                    res.redirect('/');
                }
                else{
                    return res.redirect('/');
                }
            }
            else{
                console.log('not matched');
                return res.render('login',{error:'Password did not match'});
            }
        });
    }else{
        console.log('no user is found');
        return res.render('login',{error:'No user found please sign up first..'});
    }
}     
// Add teacher
const addTeacher = async(req,res) => {
     // Add new teacher.
     let newTeacher = {
        username: req.body.teacher_name,
        password: req.body.password_teacher,
        email: req.body.teacher_email,
        teaches: req.body.teacher_subject,
        usertype: 'Teacher'
    };
    await subject.findOneAndUpdate({_id:req.body.teacher_subject},{
        $set:{
            isAssigned : true
        }
    });
    user.create(newTeacher, async(error, teacherData) => {
        if (error) {
            const fetchedSubject = await subject.find({isAssigned:false});
            res.render('addTeacher',{subjects: fetchedSubject,errorOccured:`${error}`,success:'success'});
        }
        else {
            console.log('Teacher has been added successfully', teacherData);
            const fetchedSubject = await subject.find({isAssigned:false});
            res.render('addTeacher',{subjects: fetchedSubject,errorOccured:null,success:'success'});
        }
    });
}
//Add Student
const addStudent = async(req,res) =>{
    const studentSubjects = req.body.studentSubjects;
    const image = req.files.student_image;
       // Add new student.
       let newStudent = {
        username: req.body.student_name,
        password: req.body.password_student,
        email: req.body.student_email,
        usertype: 'Student',
        image: `/img/${image.name}`
    };
    await image.mv(path.resolve(__dirname,'../public/img',image.name),async(error)=>{
        await user.create(newStudent).then(async(data)=>{
            console.log('Student has been added successfully', data);
            // Array of objects
            let arrayOfStudentSubjects = [];
            for(let i=0;i<studentSubjects.length;i++){
                arrayOfStudentSubjects.push({
                    subjectName:`${studentSubjects[i]}`,
                    subjectGrade:'x'
                });
            }
            const finalStudent = await user.findOneAndUpdate({username:newStudent.username},
                {
                    $set:{
                        learning: arrayOfStudentSubjects
                    }
                });
            console.log('Final Updated student',finalStudent);
            const fetchedSubjects = await subject.find({});
            res.render('addStudent',{subjects:fetchedSubjects,success:"Success",error:null});
        }).catch(async(error)=>{
            console.log('Erro while creating student:');
            const fetchedSubjects = await subject.find({});
            return res.render("addStudent",{subjects:fetchedSubjects,success:null,error:"Error"});
        });
    });    
}
//Add Grade
const addGrade = async(req,res) =>{
    // Fetch logged in teacher's subject
    const teacherData = await user.findById(req.session.userId).populate('teaches');
    const teacherSubject = teacherData.teaches.title;
    console.log('add Grade: teacher data : ',teacherData,teacherSubject);

    // Fetch selected student's data
    const student_name = req.body.student_name;
    const student_grade = req.body.student_grade;
    const fetchedStudents = await user.find({usertype:'Student','learning.subjectName':teacherSubject});

    const fetchedStudent = await user.findOne({username:student_name});
    const studentSubjects = fetchedStudent.learning;

    let updateAtIndex;
    for(let i=0;i<studentSubjects.length;i++){
        if(studentSubjects[i].subjectName == teacherSubject){
            updateAtIndex = i;
        }
    }

    const updatedStudent = await user.findOneAndUpdate({username:student_name},
        {
            $set:{
                [`learning.${updateAtIndex}.subjectGrade`]:student_grade
            }
        }
    );
    if(updatedStudent){
        console.log('Grade has been added');
        return res.render('addGrade',{teacher:teacherData,students:fetchedStudents,success:'Success',error:null});
    }
    else{
        console.log('Error...Grade has not been added');
        return res.render('addGrade',{teacher:teacherData,students:fetchedStudents,success:null,error:'error'});
    }
}
// Logout
const logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
}

module.exports = { processLogin, addTeacher, addStudent , addGrade ,logout };