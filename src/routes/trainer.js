const express = require("express");
const router = express.Router();
const trainerController = require("../controllers/TrainerController");
const path = require("path");
const { route } = require("express/lib/application");


router.get("/assignedCourse", trainerController.showAssignedCourses);
router.get("/assignedCourse/viewclass", trainerController.view);
router.get("/", trainerController.index);
router.get("/viewGrade", trainerController.showViewGrade);
router.get("/assignedCourse/viewTraineeStatus", trainerController.viewTraineeStatus)
module.exports = router;