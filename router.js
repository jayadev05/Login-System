const express = require("express");
const router = express.Router();


// No cache middleware
const noCache = (req, res,next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
  
};

const credential = {
  email: "admin@gmail.com",
  password: "admin@123"
};

// Login page 
router.post("/login", (req, res) => {
  console.log("Request body:", req.body);
  if (req.body.email === credential.email && req.body.password === credential.password) {
    req.session.user = req.body.email;
    res.redirect("/route/home");
  } else {
    res.render('base', { title: "Invalid", error: "UnAuthorised User" });
  }
});

// Home page with noCache middleware
router.get('/home', noCache, (req, res) => {
  if (req.session.user) {
  
    res.render('home', { user: req.session.user });
  } else {
    res.send("Unauthorized User");
  }
});

// Logout route
router.get('/login', (req, res) => {
  req.session.destroy(function (err) {
    if (err) console.log("Error");
    else res.render('base', { title: "Express", logout: "Logged Out Successfully" });
  });
});

module.exports = router;
