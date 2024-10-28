const express = require("express");
const session = require("express-session");
const passport = require("passport");
const path = require("node:path");
const bcrypt = require("bcryptjs");

const LocalStrategy = require("passport-local").Strategy;
const db = require("./db/queries");

const app = express();
const pool = require("./db/pool.js");
const pgSession = require("connect-pg-simple")(session);

// import routes
const defaultRouter = require("./routes/defaultRouter.js");
const signUpRouter = require("./routes/signUpRouter.js");
const loginRouter = require("./routes/loginRouter.js");

const PORT = 5000;
const assetsPath = path.join(__dirname, "public");

// we use session and passport before routes
// we create a database for saving the session in the database
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
    next();
});

// routers
app.use("/", defaultRouter);
app.use("/sign-up", signUpRouter);
app.use("/login", loginRouter);
app.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect("/");
    });
});
//app.use("/messages", messagesRouter);

// opening port
app.listen(PORT, () => console.log(`Server is up on port ${PORT}`));

// stuff with passport
passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await db.getUser("username", username);

            if (!user) {
                return done(null, false, { message: "Incorrect username" });
            }
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return done(null, false, { message: "Incorrect password" });
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }),
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await db.getUser("id", id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});
