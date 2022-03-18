const dotenv = require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const cookieSession = require('cookie-session');
const app = express();
const http = require('http').Server(app);

app.set('views',__dirname + '/');
app.set('vew engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(cookieSession({
    name: 'session',
    keys: ['keyboard cat'],
    // Cookie Options
    maxAge: 3 * 60 * 60 * 1000 // 72 hours
}));

app.set('trust proxy', true);
app.use(express.json()); // parse form data client
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
}
app.use(fileUpload());
// configure express to use public folder for app front end
app.use('/app-property',express.static(path.join(__dirname, 'public'))); 

app.use('/', cors(corsOptions), require('./routes/frontend'));

http.listen(process.env.PORT, process.env.HOSTNAME, () => {
    console.log(`Server running on port: http://${process.env.HOSTNAME}:${process.env.PORT}`);
});