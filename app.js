const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const app = express();


// let sessionOptions = session({
//   secret: process.env.SESSION_SECRET,
//   store: new MongoStore({
//     db: require("./db"),
//     url: "mongodb://localhost:27017/hi",
//   }),
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     maxAge: 1000 * 60 * 60 * 24,
//     httpOnly: true,
//   },
// });

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
      db: require("./db"),
      url: "mongodb://localhost:27017/hi",
    }),
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    },
  })
);

app.use(flash());

app.use(function(req, res, next) {
    res.locals.user = req.session.user;
    next();
})

const router = require('./router');

app.use(express.urlencoded({ extended: false })); //add user submitted data to req.body
app.use(express.json()); 

app.use(express.static('public'));
app.set('views', 'views');
app.set('view engine', 'ejs');

app.use('/', router)

module.exports = app;