const express = require("express");
const router = express.Router();
const { isAdmin } = require("../utils/authHandler");
const adminController = require("../controllers/AdminController");
const img = require("../utils/imageHandler");
const path = require("path");
const destination = path.join(__dirname, "../public/uploads/admins");
const destination2 = path.join(__dirname, "../public/uploads/staffs");
const destination3 = path.join(__dirname, "../public/uploads/trainers");
const width = height = 170;

router.get("/trainer-accounts/search", adminController.searchTrainerAccounts);
router.get("/trainer-accounts/passwords/set_default", adminController.setDefaultPassTer);
router.post("/trainer-accounts/update", img.upload(destination3), img.resize(width, height), adminController.updateTrainerAccount);
router.get("/trainer-accounts/edit", adminController.editTrainerAccount);
router.post("/trainer-accounts/store", img.upload(destination3), img.resize(width, height), adminController.storeTrainerAccount);
router.get("/trainer-accounts/delete", adminController.deleteTrainerAccount);
router.get("/trainer-accounts", adminController.showTrainerAccounts);

router.get("/staff-accounts/search", adminController.searchStaffAccounts);
router.get("/staff-accounts/passwords/set_default", adminController.setDefaultPassS);
router.post("/staff-accounts/update", img.upload(destination2), img.resize(width, height), adminController.updateStaffAccount);
router.get("/staff-accounts/edit", adminController.editStaffAccount);
router.post("/staff-accounts/store", img.upload(destination2), img.resize(width, height), adminController.storeStaffAccount);
router.get("/staff-accounts/delete", adminController.deleteStaffAccount);
router.get("/staff-accounts", adminController.showStaffAccounts);

router.get("/test", adminController.test);
router.get("/admin-accounts/search", isAdmin, adminController.searchAdminAccounts);
router.get("/admin-accounts/passwords/set_default", isAdmin, adminController.setDefaultPassA);
router.post("/admin-accounts/update", isAdmin, img.upload(destination), img.resize(width, height), adminController.updateAdminAccount);
router.get("/admin-accounts/edit", isAdmin, adminController.editAdminAccount);
router.post("/admin-accounts/store", isAdmin, img.upload(destination), img.resize(width, height), adminController.storeAdminAccount);
router.get("/admin-accounts/delete", isAdmin, adminController.deleteAdminAccount);
router.get("/admin-accounts", isAdmin, adminController.showAdminAccounts);
router.get("/", isAdmin, adminController.indexAction);

module.exports = router;