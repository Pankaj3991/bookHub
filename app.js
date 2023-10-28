const express = require("express");
const dotenv = require("dotenv").config({ path: './.env' });
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const Connection = require("./src/database/config/config.js");
const ExpressError = require("./src/utils/ExpressError.js");
const homeRoute = require("./src/routes/Book.js");
const reviewRoute = require("./src/routes/review.js");
const userRoute = require("./src/routes/user.js");
const User = require("./src/database/models/user.js");
const {homePage} = require("./src/controllers/Book.js");

const app = express();
Connection();

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true
    }
  }));

  // for authentication and authorization: 
passport.initialize();
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.isLoggedIn = req.user;
  next();
});

app.set("view engine", "ejs");
app.set("views", path.join(path.resolve(), "src/views"));
app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const port = 3001;

app.get("/", homePage);
app.use('/', userRoute);
app.use('/book', homeRoute);
app.use('/reviews', reviewRoute);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "page not found"));
})

app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong!" } = err;
    res.render("pages/error.ejs", { message });
});

app.listen(port, () => {
    console.log(`app is running on port: ${port}`);
})