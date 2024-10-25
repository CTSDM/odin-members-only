const db = require("../db/queries.js");
const bcrypt = require("bcryptjs");

async function getCreateUser(_, res) {
    res.render("../views/pages/createUser.ejs");
}

async function postCreateUser(req, res) {
    const newUser = {
        fname: req.body.fname,
        lname: req.body.lname,
        username: req.body.username,
        added: Date.now(),
    };
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        if (err) return next(err);
        else newUser.pw = hashedPassword;
        await db.createUser(newUser);
    });
    res.redirect("/");
}

module.exports = { getCreateUser, postCreateUser };
