const subject = require('../models/subject');

const createSubject = async(req, res) => {
    // Create new subject.
    let newSubject = {
        subject_title: req.body.subject_title.toLowerCase(),
        subject_credit: req.body.subject_credit.toLowerCase(),
    };
    const isSubjectCreated = await subject.findOne({title:newSubject.subject_title});
    if(isSubjectCreated){
        console.log('Subject is already there in the database');
        return res.render('addSubject',{subjectMessage:'Subject is already created'});
    }
    else{
        subject.create({
            title:newSubject.subject_title,
            credit:newSubject.subject_credit,
            // isAssigned:false,
        }, (error, subjectData) => {
            if (error) {
                return res.render("addSubject",{subjectMessage:'Subject was not created'});
            }
            else {
                console.log('Subject created successfully..', subjectData);
                return res.render('addSubject',{subjectMessage:'Subject has been added successfully'});
            }
        });
        console.log('New Subject has been created');
    }    
}

module.exports = createSubject;