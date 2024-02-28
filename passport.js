const LocalStrategy = require("passport-local").Strategy;
const userModel = require("./db");
const initializingPassport = (passport) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const user = await userModel.findOne({ email: email });
          if (!user) return done(null, false);
          if (user.password !== password) return done(null, false);
          return done(null, user);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userModel.findById(id);
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  });
};
isAuthenticated = (req, res, next) => {
  if (req.user) return next();
  res.redirect("/login");
};
module.exports = { initializingPassport, isAuthenticated };
