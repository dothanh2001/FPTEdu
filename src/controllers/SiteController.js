const Account = require("../models/Account");
const Admin = require("../models/Admin");
const Staff = require("../models/Staff");
const Trainer = require("../models/Trainer");
const Trainee = require("../models/Trainee");
const date = require("../utils/dateHandler")
const fs = require("fs");
const path = require("path");
const { checkPassword, encrypt } = require("../utils/hashingHandler");

class SiteController {
    indexAction(req, res, next) {
        res.render("index");
    }

    async login(req, res, next) {
        let anAccount;
        let anUser;
        var match = false;
        try {
            const email = req.body.email;
            anAccount = await Account.findOne({ email });
            if (anAccount) match = await checkPassword(req.body.password, anAccount.password);
            if (!match) return res.render("index", { msg: "Your email or password is incorrect!" });
            if (anAccount.role == "admin") {
                anUser = await Admin.findOne({ email });
            } else if (anAccount.role == "staff") {
                anUser = await Staff.findOne({ email });
            } else if (anAccount.role == "trainer") {
                anUser = await Trainer.findOne({ email });
            } else if (anAccount.role == "trainee") {
                anUser = await Trainee.findOne({ email });
            }
            req.session["user"] = {
                email: anUser.email,
                name: anUser.name,
                image: anUser.image,
                role: anAccount.role
            }
        } catch (err) {
            console.log(err);
            return next(err);
        }
        res.redirect(`/${anAccount.role}`);
    }

    logout(req, res, next) {
        req.session.destroy();
        res.redirect("/");
    }

    showProfile(req, res, next) {
        const role = req.session.user.role;
        if (role == "admin") {
            Admin.findOne({ email: req.session.user.email }, (err, admin) => {
                const user = req.session.user;
                if (!err) {
                    res.render("admin/profile", {
                        admin,
                        user,
                        email: req.session.user.email
                    });
                } else next(err);
            });
        } else if (role == "staff") {
            Staff.findOne({ email: req.session.user.email }, (err, staff) => {
                const user = req.session.user;
                if (!err) {
                    res.render("staff/profile", {
                        staff,
                        user,
                        email: req.session.user.email
                    });
                } else next(err);
            });
        } else if (role == "trainer") {
            Trainer.findOne({ email: req.session.user.email }, (err, trainer) => {
                const user = req.session.user;
                if (!err) {
                    res.render("trainer/profile", {
                        trainer,
                        user,
                        email: req.session.user.email
                    });
                } else next(err);
            });
        } else if (role == "trainee") {
            Trainee.findOne({ email: req.session.user.email }, (err, trainee) => {
                const user = req.session.user;
                if (!err) {
                    res.render("trainee/profile", {
                        trainee,
                        user,
                        email: req.session.user.email
                    });
                } else next(err);
            });
        }
    }

    editProfile(req, res, next) {
        const role = req.session.user.role;
        if (role == "admin") {
            Admin.findById(req.query.id, (err, admin) => {
                if (!err) res.render("admin/editProfile", { admin, user: req.session.user });
                else next(err);
            });
        } else if (role == "staff") {
            Staff.findById(req.query.id, (err, staff) => {
                if (!err) res.render("staff/editStaff", { staff, user: req.session.user });
                else next(err);
            });
        } else if (role == "trainer") {
            Trainer.findById(req.query.id, (err, trainer) => {
                if (!err) res.render("trainer/edit", { trainer, user: req.session.user });
                else next(err);
            });
        } else if (role == "trainee") {
            Trainee.findById(req.query.id, (err, trainee) => {
                if (!err) res.render("trainee/edit", { trainee, user: req.session.user });
                else next(err);
            });
        }
    }

    updateProfile(req, res, next) {
        const role = req.session.user.role;
        console.log("dasdasdasdasd")
        if (role == "admin") {
            const obj = {
                email: req.body.email,
                name: req.body.name,
                dob: date.convertDateAsString(req.body.dob),
                address: req.body.address,
                image: {
                    data: fs.readFileSync(req.file.path),
                    contentType: "image/png"
                }
            }

            Admin.updateOne({ _id: req.query.id }, obj, err => {
                if (!err) res.redirect('/' + req.session.user.name.split(" ").join(""));
                else next(err);
            });
        } else if (role == "staff") {
            const obj = {
                email: req.body.email,
                name: req.body.name,
                dob: date.convertDateAsString(req.body.dob),
                address: req.body.address,
                image: {
                    data: fs.readFileSync(req.file.path),
                    contentType: "image/png"
                }
            }
            Staff.updateOne({ _id: req.query.id }, obj, err => {
                if (!err) res.redirect('/' + req.session.user.name.split(" ").join(""));
                else next(err);
            });
        } else if (role == "trainer") {
            const obj = {
                email: req.body.email,
                name: req.body.name,
                dob: date.convertDateAsString(req.body.dob),
                address: req.body.address,
                specialty: req.body.specialty,
                image: {
                    data: fs.readFileSync(req.file.path),
                    contentType: "image/png"
                }
            }
            Staff.updateOne({ _id: req.query.id }, obj, err => {
                if (!err) res.redirect('/' + req.session.user.name.split(" ").join(""));
                else next(err);
            });
        } else if (role == "trainee") {
            const obj = {
                email: req.body.email,
                name: req.body.name,
                dob: date.convertDateAsString(req.body.dob),
                address: req.body.address,
                education: req.body.education,
                image: {
                    data: fs.readFileSync(req.file.path),
                    contentType: "image/png"
                }
            }
            Trainee.updateOne({ _id: req.query.id }, obj, err => {
                if (!err) res.redirect('/' + req.session.user.name.split(" ").join(""));
                else next(err);
            });
        }
    }

    changePassword(req, res, next) {
        res.render("site/changePassword", { user: req.session.user });
    }

    async storePassword(req, res, next) {
        try {
            const user = req.session.user;
            if (!(req.body.newP == req.body.confirmNP)) {
                return res.render("site/changePassword", {
                    user,
                    msg3: {
                        s1: "The passwords you entered do not match.",
                        s2: "Check your typing and try again."
                    }
                });
            }
            const anAccount = await Account.findOne({ email: user.email });
            const match = await checkPassword(req.body.oldP, anAccount.password);
            if (!match) {
                return res.render("site/changePassword", {
                    user,
                    msg: "Make sure your entry is correct."
                });
            }
            const passwordHash = await encrypt(req.body.newP);
            await Account.updateOne({ email: user.email }, { password: passwordHash });
        } catch (err) {
            console.log(err);
            return next(err);
        }
        res.redirect("/logout");
    }
}

module.exports = new SiteController();