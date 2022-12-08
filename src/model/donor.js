let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let donorSchema = new Schema({
    donor_name:{
        type: String,
        required: true,
        trim: true,
        // maxlength: 22
    },
    donor_password:{
        type: String,
        required: true
    },
    donor_phone:{
        type: String,
        required: true,
        // min: 11,
        // max: 11
    },   
    blood_group:{
        type: String,
        required: true
    },
    donor_address:{
        type: String,
        required: true,
        trim: true
    }
});

module.exports = mongoose.model('donor', donorSchema);