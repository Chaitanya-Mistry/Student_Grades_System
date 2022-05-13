const adminAuthentication = (req,res,next) =>{
    if(req.session.userId){
        if(req.session.userType !== 'Admin'){
            return res.redirect('/');
        }
    }
    else{
        return res.redirect('/');
    }
    next();
}
module.exports = adminAuthentication;
