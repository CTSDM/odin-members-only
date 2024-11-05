const express = require("express");
const session = require("express-session");
const passport = require("passport");
const path = require("node:path");
const app = express();
const pool = require("./db/pool.js");
const pgSession = require("connect-pg-simple")(session);

// import routes
const defaultRouter = require("./routes/defaultRouter.js");
const signUpRouter = require("./routes/signUpRouter.js");
const loginRouter = require("./routes/loginRouter.js");
const messageRouter = require("./routes/messageRouter.js");

const PORT = 5000;
const assetsPath = path.join(__dirname, "public");

// we use session and passport before routes
// we create a database for saving the session in the database
require("./config/passport.js");
app.use(
    session({
        secret: "OliveYoung",
        resave: false,
        saveUninitialized: true,
        store: new pgSession({
            pool: pool,
            createTableIfMissing: true,
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24,
        },
    }),
);
app.use(passport.session());
app.use(express.static(assetsPath));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Adding the user information on all the views
// However, a more sensible approach would be instead to pass only some data from the user?
app.use((req, res, next) => {
    res.locals.user = req.user;
    if (req.session.messages)
        res.locals.errMsg =
            req.session.messages[req.session.messages.length - 1];
    next();
});

// routers
app.use("/", defaultRouter);
app.use("/sign-up", signUpRouter);
app.use("/login", loginRouter);
app.use("/message", messageRouter);
app.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect("/");
    });
});

// opening port
app.listen(PORT, () => console.log(`Server is up on port ${PORT}`));
