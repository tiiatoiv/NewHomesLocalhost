'use strict';
require('dotenv').config();

const express = require('express');
const app = express(); 
const cors = require('cors');
const port = 5500;
const passport = require('./utils/pass');
const dogRoute = require('./routes/dogRoute');
const userRoute = require('./routes/userRoute');
const breedRoute = require('./routes/breedRoute');
const authRoute = require('./routes/authRoute');
const messageRoute = require('./routes/messageRoute');

app.use(cors());
app.use(express.json());   //for parsing application/json
app.use(express.urlencoded({extended: true}));  //for parsing application/x-www-form-urlencoded
app.use(express.static('uploads'));

app.use('/thumbnails', express.static('thumbnails'));


/*if(process.env.SERVER === 'dev_localhost') {
    require('./secure/localhost')(app);
} else {
    require('./secure/server')(app);
    app.listen(5500, () => {
        console.log('server app start?')
    });
}*/
app.use('/dog', passport.authenticate(['jwt', 'anonymous'], {session: false}), dogRoute);
app.use('/user', passport.authenticate('jwt', {session: false}), userRoute);
app.use('/breed', passport.authenticate(['jwt', 'anonymous'], {session: false}), breedRoute);
app.use('/auth', authRoute);
app.use('/message', passport.authenticate('jwt', {session: false}), messageRoute);

app.listen(port, () => console.log(`App listens on port ${port}!`));

