const { env } = require("../config/config.js");
const db = require("../db/queries.js");
const bcrypt = require("bcryptjs");
const passport = require("passport");

async function getCreateUser(_, res) {
    res.render("../views/pages/createUser.ejs");
}

const postCreateUser = [
    async function (req, res) {
        const newUser = {
            fname: req.body.fname,
            lname: req.body.lname,
            username: req.body.username,
            added: Date.now(),
        };
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
            addUserStatus(newUser, req.body.secretCode);
            if (err) return next(err);
            else newUser.pw = hashedPassword;
            await db.createUser(newUser);
        });
        res.redirect("/");
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
