const user = require('../models/user');
const bcrypt = require('bcrypt');
const { compareSync } = require('bcrypt');
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
                // If the user is admin
                if(userData.usertype == 'Admin'){
                    req.session.userId = userData._id;
                    req.session.userType = userData.usertype;
                    return res.redirect('/');
                }
                else if(userData.usertype == 'Teacher'){
                    req.session.userId = userData._id;
                    req.session.userType = userData.usertype;
                    console.log('Yes logged in user is :Teacher');
                    res.redirect('/addGrade');
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
// Sign Up 
const registerUser = (req, res) => {
    // Create new user.
    let newUser = {
        username: req.body.uname,
        password: req.body.upassword,
        usertype: req.body.usertype,
    };
    user.create(newUser, (error, userData) => {
        if (error) {
            return res.redirect("/sign_up");
        }
        else {
            console.log('User registered successfully..', userData);
            res.redirect('login');
        }
    });
}
// Add teacher
const addTeacher = (req,res) => {
     // Add new teacher.
     let newTeacher = {
        username: req.body.teacher_name,
        password: req.body.password_teacher,
        email: req.body.teacher_email,
        teaches: req.body.teacher_subject,
        usertype: 'Teacher'
    };
    user.create(newTeacher, (error, teacherData) => {
        if (error) {
            return res.redirect("/addTeacher");
        }
        else {
            console.log('Teacher has been added successfully', teacherData);
            res.redirect('/addTeacher');
        }
    });
}
//Add Student
const addStudent = async(req,res) =>{
    const studentSubjects = req.body.studentSubjects;
       // Add new student.
       let newStudent = {
        username: req.body.student_name,
        password: req.body.password_student,
        email: req.body.student_email,
        usertype: 'Student'
    };
    console.log(studentSubjects);
    const studentData = await user.create(newStudent);
    if(studentData){
        console.log('Student has been added successfully', studentData);
        // Array of objects
        for(let i=0;i<studentSubjects.length;i++){
            studentData.learning.push({
                subjectName:`${studentSubjects[i]}`,
                subjectGrade:'x'
            });
        }
        const finalStudent = await studentData.save();
        console.log(finalStudent);
        res.redirect('/addStudent');
    }
    else{
        console.log('Erro while creating student:',error)
        return res.redirect("/addStudent");
    }
        

}
//Add Grade
const addGrade = async(req,res) =>{
    // Fetch logged in teacher's subject
    const teacherData = await user.findById(req.session.userId);
    const teacherSubject = teacherData.teaches;

    // Fetch selected student's data
    const student_name = req.body.student_name;
    const student_grade = req.body.student_grade;

    // const studentData = await user.findOneAndUpdate({username:req.body.student_name},
    //     {
    //         $set:{
                
    //         }
    //     });
}
// Logout
const logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
}

module.exports = { registerUser, processLogin, addTeacher, addStudent ,logout };