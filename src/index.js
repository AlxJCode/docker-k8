const express = require('express');
const path = require('path');

const app = express();
require('./database');

app.set('port', process.env.PORT || 4000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());


app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./routes/routes'));


app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});