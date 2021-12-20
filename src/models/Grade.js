const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Grade = new Schema({
    id: {type: String },
    traineeId: {type:String},
    courseClassId: { type: String },
    grade: {type: Number }
});

module.exports = mongoose.model("Grades", Grade);