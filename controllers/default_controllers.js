function getPrint(req, res) {
    res.render("../views/pages/index.ejs", { user: req.user });
}

module.exports = getPrint;
