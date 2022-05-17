const studentAuthentication = (req,res,next) =>{
    if(req.session.userId){
        if(req.session.userType !== 'Student'){
            return res.redirect('/');
        }
    }
    else{
        return res.redirect('/');
    }
    next();
}
module.exports = studentAuthentication;
