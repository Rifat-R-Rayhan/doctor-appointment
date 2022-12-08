let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let scheduleSchema = new Schema({
    p_id:{
        type: String
    },
    user_name:{
        type: String
    },
    doctor_name:{
        type: String
    },
    hospital:{
        type: String
    },
    doctor_contact:{
        type: Number
    },
    date:{
        type: Date
    },
    time:{
        type: String
    }
});

module.exports = mongoose.model('patientSchedule', scheduleSchema);
// module.exports = user;