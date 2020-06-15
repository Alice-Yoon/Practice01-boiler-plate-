const express = require('express');
const app = express();
const port = 5000;

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://aliceyn:tkfkdgo2004*@boilerplate.vvxhv.mongodb.net/boilerplate?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB connected...')).catch( err => console.log(err))

app.get('/', (req, res) => res.send('Hello World!! 안뇽안뇽!'));

app.listen(port, () => console.log(`Example app listening on port ${port}`));

