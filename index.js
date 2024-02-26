require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5555;
const DB_URL = process.env.DB_URL;
const userModel = require("./db");
const mongoose = require("mongoose");
const passport = require("passport");
const expressSession = require("express-session");
const { initializingPassport, isAuthenticated } = require("./passport");

mongoose.connect(DB_URL).then(() => {
  console.log("Database is connected");
});

initializingPassport(passport);
app.use(
  expressSession({ secret: "secret", resave: false, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});
//----------------register---------------
app.get("/register", (req, res) => {
  res.render("register");
});
app.post("/register", async (req, res) => {
  const user = await userModel.findOne({ username: req.body.username });
  if (user) return res.send("User existed");
  const newUser = await userModel.create(req.body);
  res.json({ data: newUser, message: "sucess" });
});

//----------------login---------------
app.get("/login", (req, res) => {
  res.render("login");
});
app.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/register" }),
  function (req, res) {
    res.redirect("/profile");
  }
);
//----------------profile---------------
app.get("/profile", isAuthenticated, (req, res) => {
  res.send(req.user);
});

//----------------log out---------------
app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at port:${PORT}`);
});
