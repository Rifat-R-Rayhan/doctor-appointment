let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let adminSchema = new Schema({
    admin_name:{
        type: String,
        required: true,
        trim: true,
        // maxlength: 22
    },


    admin_password:{
        type: String,
        required: true
    },

});

module.exports = mongoose.model('admin', adminSchema);