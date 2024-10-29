const { env } = require("../config/config.js");
const db = require("../db/queries.js");
const bcrypt = require("bcryptjs");
const passport = require("passport");

async function getCreateUser(_, res) {
    res.render("../views/pages/createUser.ejs");
}

const postCreateUser = [
    async function (req, res) {
        const username = await db.getUser("username", req.body.username);
        if (username === undefined) {
            const newUser = {
                fname: req.body.fname,
                lname: req.body.lname,
                username: req.body.username,
                added: Date.now(),
            };
            newUser.pw = await bcrypt.hash(req.body.password, 10);
            addUserStatus(newUser, req.body.secretCode);
            await db.createUser(newUser);
            passport.authenticate("local")(req, res, function () {
                res.redirect("/");
            });
        } else {
            res.locals.messageError = "Username already in use";
            res.render("./pages/createUser.ejs");
        }
    },
];

function addUserStatus(user, code) {
    user.member = false;
    user.admin = false;
    if (code === env.adminCode) {
        user.admin = true;
        user.member = true;
    } else if (code === env.memberCode) user.member = true;
}

module.exports = { getCreateUser, postCreateUser };
