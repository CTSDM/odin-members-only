const db = require("../db/queries.js");

function printMessageForm(_, res) {
    res.render("./pages/createMessage.ejs");
}

async function postMessage(req, res) {
    const message = {
        title: req.body.title,
        author: req.user.username,
        // DB and JS have different scale for time
        added: Date.now() / 1000,
        content: req.body.message,
    };
    await db.addMessage(message);
    res.locals.messages = await db.getMessagesWithUsers();
    res.redirect("/");
}

module.exports = { printMessageForm, postMessage };
