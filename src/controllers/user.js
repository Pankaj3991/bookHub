const User = require("../database/models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");

module.exports.renderSignUp = wrapAsync(async (req, res) => {
    res.render("pages/signup.ejs");

});

module.exports.signUp = wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.flash("success", `Hello ${username}, I welcome you to BookHub`);
        // for automatically login as user signup
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", `Hello ${username}, Welcome to BookHub`);
            res.redirect("/");
        });
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }
});

module.exports.renderLogin = wrapAsync(async (req, res) => {
    res.render("pages/login.ejs");
});

module.exports.login = wrapAsync(async (req, res) => {
    req.flash("success", "Welcome back to BookHub")
    let redirectingUrl = (res.locals.redirectUrl) || "/";
    res.redirect(redirectingUrl);
    // req.session.redirectUrl is created in authentication.js
});

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "logged you out!");
        res.redirect("/");
    });
}