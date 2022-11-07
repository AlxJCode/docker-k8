const mongoose = require('mongoose');

mongoose.connect('mongodb://monguito:27017/PlayList', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(con => console.log('Database is connected'))
    .catch(e => console.error(e));