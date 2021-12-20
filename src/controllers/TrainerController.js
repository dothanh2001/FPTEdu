const Trainer = require("../models/Trainer");
const fs = require("fs");
const path = require("path");
const avatarPath = path.join(__dirname, "../public/uploads/trainer");
const CourseClass = require("../models/CourseClass")
const Trainee = require("../models/Trainee");
const Grade = require("../models/Grade");

class TrainerController {
    index(req, res) {
        console.log(req.session);
        res.render("trainer", { user: req.session.user });
    }
    // View traniees in selected class
    view(req, res) {
        CourseClass.findById({ _id: req.query.id }, (err, courseClass) => {
            const mapTraineeId = courseClass.trainees;
            // find all trainee in list of trainee code
            Trainee.find({ code: { $in: mapTraineeId } }, (err, listTrainees) => {
                console.log(req.query.id);
                 Grade.find({
                             courseClassId: req.query.id
                         }, (err, listGrade) => {
                   if (!err && listGrade.length > 0){ 
                       console.log("abc" + listGrade);
                       listTrainees.forEach(trainee => {
                           listGrade.forEach(gradeItem => {
                               if (gradeItem.traineeId == trainee._id){
                                   trainee.grade = gradeItem.grade;
                               }
                           })
                       })
                       listTrainees.forEach(trainee => {
                           if(trainee.grade == undefined){
                               trainee.grade = 'Not Have'
                           }
                       })
                       res.render("trainer/viewtrainees", {
                       class_name: courseClass.class_name,
                       data: listTrainees,
                       courseId: req.query.id
                   })
                }else {next(err)};
                 });
            })
        });
    }
    // view trainee status
    viewTraineeStatus(req,res){
        console.log(req.query);
    }

    showViewGrade(req, res) {
        Grade.find({}, (err, grade) => {
            console.log(grade)
            const total = grade.length;
            if (!err) res.render("trainer/viewGrade", { data: grade, total });
            else next(err);
        });
    }

    showAssignedCourses(req, res) {
        // user session as trainer logined
        let trainer = req.session.user;
        console.log(trainer);
        // find courseClass based on trainer Code
        CourseClass.find({
            trainer: trainer.code
        }, (err, courseClasses) => {
            const total = courseClasses.length;
            console.log(`err = ${err}`);
            if (!err) res.render("trainer/assignedCourses", { data: courseClasses });
            else next(err);
        });
    }
}

module.exports = new TrainerController();