const { json } = require('body-parser');
const express = require('express');
const router = express.Router();
const session = require('express-session');
const config = require('../config/config');
router.use(session({secret:config.sessionSecret}));
const user = require('../src/model/user');
const admin = require('../src/model/admin');
const schedule = require('../src/model/schedule');
const donor = require('../src/model/donor');
const doctor = require('../src/model/doctor');
const bloodSchedule = require('../src/model/bloodSchedule');





// **** User part for appointment****/

//ROUTE TO SHOW HOMEPAGE(user)
router.get('/',(req,res)=>{
    res.render('homepage');
});


//ROUTE TO SHOW REGISTRATION FORM(user)
router.get('/registration',(req,res)=>{

    doctor.find((err, docs) => {
        if(!err){
            res.render('registration', {doctors: docs});
        }
        else{
            console.log("Error 404 " + err)
        }
    });
});


//ROUTE TO COLLECT USER DATA FROM REGISTRATION FORM TO DATABASE
router.post('/send', (req, res) => {

    // let user_name = req.body.user_name;
    // let user_phone = req.body.user_phone;
    // let user_email = req.body.user_email;
    // let user_password = req.body.user_password;
    // let user_address = req.body.user_address;
    const {user_name, user_phone, user_email, user_password, user_address, doctor_name} = req.body;

    //console.log(user_name, user_phone, user_email, user_password, user_address, doctor_name);

    const userInfo = new user({
        user_name,
        user_phone,
        user_email,
        user_password,
        user_address,
        doctor_name
    });
    userInfo.save((err) => {
        if(err){
            res.redirect('/error');
            console.log(err);
        }
        else{
            console.log("Data save successfully");
            res.redirect('/success');
        }
    });
});


//ROUTE TO SHOW SUCCESS MSG(REGISTRATION) FOR USER
router.get('/success', (req, res)=> {
    res.render('msg/successMSG');
});


//ROUTE TO SHOW ERROR MSG(REGISTRATION) FOR USER
router.get('/error', (req, res)=> {
    res.render('msg/errorMSG');
});


//ROUTE TO SHOW LOGIN FORM
router.get('/userlogin',(req,res)=>{
    res.render('login');
});


//User login validation
router.post('/userlogin',async(req,res)=>{
    try{
            const email = req.body.email;
            const password = req.body.password;
            
            const userEmail = await user.findOne({user_email:email})

            if(userEmail.user_password === password){
                req.session.user_id = userEmail._id;
                res.redirect('/userhomepage');
            }
            else{
                res.redirect('/uservalidation');
            }
        } catch(error){
            res.redirect('/uservalidation');
    }
});


//ROUTE TO SHOW INVALID MSG FOR USER
router.get('/uservalidation', (req, res)=> {
    res.render('msg/userValidation');
});


//ROUTE TO SHOW USER HOMEPAGE(after userlogin)
router.get('/userhomepage',async(req,res)=>{
    //res.render('userhomepage');
    try{
        const userEmail = await user.findById({_id:req.session.user_id});
        res.render('userhomepage', {user:userEmail});
    }
    catch(err){
        console.log("Error");
    }
    
});


//SEARCH doctor by his/her department name(user)
router.post('/searchDoctor',async(req,res)=>{
    try{
            const name = req.body.name;           
            const doctorDept = await doctor.find({doctor_dept:name});
            res.render('doctorList', {doctors: doctorDept});

        } catch(error){
            console.log("Doctor's not found" + error);
    }
});

//ROUTE TO SHOW SCHEDULE INFORMATION after User Login and click(user)
router.get('/schedule',async(req,res)=>{
    schedule.find((err, docs) => {
        if(!err){
            res.render('scheduleInfo', {patientschedules: docs});
        }
        else{
            console.log("Error 404 " + err)
        }
    });
});
router.get('/schedules/:id',async(req,res)=>{
    schedule.find({p_id: req.params.id},(err, docs) => {
        if(!err){
            res.render('scheduleInfo', {patientschedules: docs});
        }
        else{
            console.log("Error 404 " + err)
        }
    });
});




//**** Blood part for USER ****/
//ROUTE TO SHOW Blood Donor DATA(user) 
router.get('/bloodDonorDataForUser',(req,res)=>{
    donor.find((err, docs) => {
        if(!err){
            res.render('showDonorlist', {donors: docs});
        }
        else{
            console.log("Error 404 " + err)
        }
    });
}); 

//SEARCH blood donor data by blood group (USER)
router.post('/searchBlood',async(req,res)=>{
    try{
            const name = req.body.name;           
            const BloodGroup = await donor.find({blood_group:name});
            res.render('showDonorlist', {donors: BloodGroup});

        } catch(error){
            console.log("Invalid Blood Group" + error);
    }
});

//ROUTE TO SHOW BLOOD DONOR REGISTRATION FORM(user)
router.get('/bloodDonorReg',(req,res)=>{
    res.render('blood/bloodDonorReg');
});


//ROUTE TO COLLECT Blood Donor DATA FROM REGISTRATION FORM TO DATABASE
router.post('/sendDonorInfo', (req, res) => {
    const {donor_name, donor_password, donor_phone, blood_group, donor_address} = req.body;

    // console.log(donor_name, donor_phone, blood_group, donor_address);

    const donorInfo = new donor({
        donor_name, 
        donor_password,
        donor_phone, 
        blood_group, 
        donor_address
    });
    donorInfo.save((err) => {
        if(err){
            res.redirect('/error');
            console.log(err);
        }
        else{
            console.log("Data save successfully");
            res.redirect('/');
        }
    });
});


//ROUTE TO SHOW Donor login form
router.get('/donorlogin',(req,res)=>{
    res.render('blood/donorLogin');
});


//check donor login validation
router.post('/donorlogin',async(req,res)=>{
    try{
            const donor_name = req.body.donor_name;
            const donor_password = req.body.donor_password;
            
            const Donor = await donor.findOne({donor_name:donor_name})

            if(Donor.donor_password === donor_password){
                req.session.donor_id = Donor._id;
                res.redirect('/donorhomepage');
            }
            else{
                res.redirect('/invalidDonor');
            }
        } catch(error){
            res.redirect('/invalidDonor');
    }
});


//ROUTE TO SHOW INVALID MSG FOR DONOR
router.get('/invalidDonor', (req, res)=> {
    res.render('msg/donorValidation');
});


//ROUTE TO SHOW USER DonorHOMEPAGE(after donorlogin)
router.get('/donorhomepage',async(req,res)=>{
    try{
        const Donor = await donor.findById({_id:req.session.donor_id});
        res.render('blood/donorhomepage', {donor:Donor});
    }
    catch(err){
        console.log("Error");
    }
    
});


//ROUTE TO SHOW SCHEDULE INFORMATION after donor login(user/donor)
router.get('/scheduledonor',(req,res)=>{
    bloodSchedule.find((err, docs) => {
        if(!err){
            res.render('blood/bloodSchedule', {donorschedules: docs});
        }
        else{
            console.log("Error 404 " + err)
        }
    });
});
router.get('/scheduledonors/:id',async(req,res)=>{
    bloodSchedule.find({b_id: req.params.id},(err, docs) => {
        if(!err){
            res.render('blood/bloodSchedule', {donorschedules: docs});
        }
        else{
            console.log("Error 404 " + err)
        }
    });
});





//**** ADMIN part ****/

//ROUTE TO SHOW ADMIN LOGIN
router.get('/adminlogin',(req,res)=>{
    res.render('admin/adminLogin');
});

//check admin login validation
router.post('/adminlogin',async(req,res)=>{
    try{
            const admin_name = req.body.admin_name;
            const password = req.body.password;
            
            const userEmail = await admin.findOne({admin_name:admin_name})

            if(userEmail.admin_password === password){
                res.redirect('/userdata');
            }
            else{
                res.redirect('/invalidAdmin');
            }
        } catch(error){
            res.redirect('/invalidAdmin');
    }
});


//ROUTE TO SHOW INVALID MSG FOR ADMIN
router.get('/invalidAdmin', (req, res)=> {
    res.render('msg/adminValidation');
});



//ROUTE TO SHOW USER DATA(admin)
router.get('/userdata',(req,res)=>{
    user.find((err, docs) => {
        if(!err){
            res.render('admin/userData', {users: docs});
        }
        else{
            console.log("Error 404 ")
        }
    });

});

//ROUTE TO SHOW USER DATA FOR UPDATE(admin)
router.get('/editInfo/:id',(req,res)=>{
    console.log(req.params.id);
    user.findOneAndUpdate({_id: req.params.id}, req.body, {new:true}, (err, docs) => {
        if(err){
            console.log("Data can't edit because of some error");
        }
        else{
            res.render('admin/editInfo', {user: docs});
        }
    });
});


//ROUTE TO UPDATE DATA AND SUBMIT(admin update user data and save)
router.post('/editInfo/:id',(req,res)=>{
    console.log(req.params.id);
    user.findByIdAndUpdate({_id: req.params.id}, req.body, (err, docs) => {
        if(err){
            console.log("Data can't update because of some error");
        }
        else{
            res.redirect('/updatemsg');
        }
    });
});


//ROUTE TO SHOW UPDATE CONFIRMATION MSG FOR ADMIN
router.get('/updatemsg', (req, res)=> {
    res.render('msg/updateMSG');
});


//ROUTE TO DELETE USER DATA(admin delete user data)
router.get('/delete/:id',(req,res)=>{
    console.log(req.params.id);
    user.findByIdAndDelete({_id: req.params.id}, (err, docs) => {
        if(err){
            console.log("Data can't deleted because of some error");
        }
        else{
            console.log("Delete successfully");
            res.redirect('/userdata');
        }
    });
});



//SEARCH user data(admin search user by their name)
router.post('/search',async(req,res)=>{
    try{
            const name = req.body.name;           
            const userName = await user.find({user_name:name});
            res.render('admin/userData', {users: userName});

        } catch(error){
            console.log("Invalid Username" + error);
    }
});



//**** Patient Schedule Part ****/
//ROUTE TO SHOW USER DATA and Set the patient schedule(admin)
router.get('/schedule/:id',(req,res)=>{
    console.log(req.params.id);
    user.findOneAndUpdate({_id: req.params.id}, req.body, {new:true}, (err, docs) => {
        if(err){
            console.log("Data can't edit because of some error");
        }
        else{
            res.render('admin/patientSchedule', {user: docs});
        }
    });
});


//ROUTE TO COLLECT PATIENT SCHEDULE DATA FROM SCHEDULE FORM TO DATABASE
router.post('/add', (req, res) => {
    const {p_id, user_name, doctor_name, hospital, doctor_contact, date, time} = req.body;

    const patientScheduleInfo = new schedule({
        p_id,
        user_name, 
        doctor_name, 
        hospital, 
        doctor_contact, 
        date, 
        time
    });
    patientScheduleInfo.save((err) => {
        if(err){
            res.redirect('/error');
            console.log(err);
        }
        else{
            console.log("Data save successfully");
            res.redirect('/schedule');
        }
    });
});





//**** Blood part for ADMIN****/

//ROUTE TO SHOW Blood Donor DATA(admin)
router.get('/bloodDonorData',(req,res)=>{
    donor.find((err, docs) => {
        if(!err){
            res.render('admin/bloodDonorlist', {donors: docs});
        }
        else{
            console.log("Error 404 " + err)
        }
    });

});

//ROUTE TO SHOW DONOR DATA FOR UPDATE(admin)
router.get('/editdonor/:id',(req,res)=>{
    console.log(req.params.id);
    donor.findOneAndUpdate({_id: req.params.id}, req.body, {new:true}, (err, docs) => {
        if(err){
            console.log("Data can't edit because of some error");
        }
        else{
            res.render('admin/bloodInfo', {donor: docs});
        }
    });
});


//ROUTE TO UPDATE DONOR DATA AND SUBMIT(admin update donor information and save)
router.post('/editdonor/:id',(req,res)=>{
    console.log(req.params.id);
    donor.findByIdAndUpdate({_id: req.params.id}, req.body, (err, docs) => {
        if(err){
            console.log("Data can't update because of some error");
        }
        else{
            res.redirect('/bloodDonorData');
        }
    });
});


//ROUTE TO DELETE DONOR DATA(admin delete donor data)
router.get('/deletedonor/:id',(req,res)=>{
    console.log(req.params.id);
    donor.findByIdAndDelete({_id: req.params.id}, (err, docs) => {
        if(err){
            console.log("Data can't deleted because of some error");
        }
        else{
            console.log("Delete successfully");
            res.redirect('/bloodDonorData');
        }
    });
});

//SEARCH blood donor data(admin search donor data by their name)
router.post('/searchDonor',async(req,res)=>{
    try{
            const name = req.body.name;           
            const donorName = await donor.find({donor_name:name});
            res.render('admin/bloodDonorlist', {donors: donorName});

        } catch(error){
            console.log("Invalid Username" + error);
    }
});



//****Blood donor Schedule ****/
//ROUTE TO SHOW USER DATA and Set the blood donor schedule(admin set the donor schedule)
router.get('/scheduledonor/:id',(req,res)=>{
    console.log(req.params.id);
    donor.findOneAndUpdate({_id: req.params.id}, req.body, {new:true}, (err, docs) => {
        if(err){
            console.log("Data can't edit because of some error");
        }
        else{
            res.render('admin/bloodScheduleForm', {donor: docs});
        }
    });
});


//ROUTE TO COLLECT DONOR SCHEDULE DATA FROM DATABASE
router.post('/addDonorSchedule', (req, res) => {
    const {b_id, donor_name, hospital_address,  date, time} = req.body;

    const donorScheduleInfo = new bloodSchedule({
        b_id,
        donor_name, 
        hospital_address, 
        date, 
        time
    });
    donorScheduleInfo.save((err) => {
        if(err){
            console.log(err);
        }
        else{
            console.log("Data save successfully");
            res.redirect('/scheduledonor');
        }
    });
});






//**** Doctor's part */

//ROUTE TO SHOW DOCTOR REGISTRATION FORM
router.get('/doctor',(req,res)=>{
    res.render('admin/addDoctor');
});


//ROUTE TO COLLECT DOCTOR DATA FROM REGISTRATION FORM TO DATABASE

router.post('/addDoctor', (req, res) => {

    const {doctor_name, doctor_phone, doctor_email, doctor_dept, doctor_chamber} = req.body;


    const doctorInfo = new doctor({
        doctor_name, 
        doctor_phone, 
        doctor_email, 
        doctor_dept, 
        doctor_chamber
    });
    doctorInfo.save((err) => {
        if(err){
            console.log(err);
        }
        else{
            console.log("Data save successfully");
            res.redirect('/doctorlist');
        }
    });
});

//ROUTE TO SHOW DOCTOR DATA
router.get('/doctorlist',(req,res)=>{
    doctor.find((err, docs) => {
        if(!err){
            res.render('doctorList', {doctors: docs});
        }
        else{
            console.log("Error 404 " + err)
        }
    });

});

module.exports = router;