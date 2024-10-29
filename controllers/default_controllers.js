const db = require("../db/queries.js");

async function getPrint(req, res) {
    res.locals.messages = await db.getMessagesWithUsers();
    res.render("../views/pages/index.ejs", { user: req.user });
}

module.exports = getPrint;
