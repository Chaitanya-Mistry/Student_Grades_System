const teacherAuthentication = (req,res,next) =>{
    if(req.session.userId){
        if(req.session.userType !== 'Teacher'){
            return res.redirect('/');
        }
    }
    else{
        return res.redirect('/');
    }
    next();
}
module.exports = teacherAuthentication;
