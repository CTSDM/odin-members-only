const passport = require("passport");

function getLogin(_, res) {
    res.render("../views/pages/login.ejs");
}

const postLogin = [
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/",
    }),
];

module.exports = { getLogin, postLogin };
