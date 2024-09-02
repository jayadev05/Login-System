const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const { v4: uuidv4 } = require("uuid");
const router = require("./router"); // Import your router module
const nocache = require("nocache");
const app = express();



app.use(nocache());


// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: uuidv4(),
  resave: false,
  saveUninitialized: true
}));

// Middleware to prevent caching on specific routes
const noCache = (req, res, next) => {

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
 next();
};




app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Set view engine
app.set('view engine', 'ejs');



// Apply noCache middleware to specific routes
app.use('/route/home', noCache);
app.use('/', noCache);

// Use the router for /route path
app.use('/route', router);

// login route with no-cache middleware
app.get("/", noCache, (req, res) => {
  res.render('base', { title: "Login System" }); // Render the EJS template
});

// Start the server
app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});
