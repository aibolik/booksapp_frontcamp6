const express = require('express');
const cors = require('cors');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fs = require('fs');
const moment = require('moment');
const authentication = require('./controllers/AuthenticationController');

const index = require('./routes/index');
const blogs = require('./routes/blogs');
const user = require('./routes/user');

const app = express();

app.use(cors());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

let requestsLogStream = fs.createWriteStream(path.join(__dirname, 'requests.log'), {flags: 'a'})

logger.token('time', (req) => {
    return moment().format('MMMM Do YYYY, h:mm:ss a');
})
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger(':time :method :url :status :response-time ms - :res[content-length]', {stream: requestsLogStream}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/user', user);
app.get('/login', (req, res) => res.render('login'));
app.post('/login', authentication);
app.use('/blogs', blogs);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message || 'Sorry, but this page does not exist!';
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
