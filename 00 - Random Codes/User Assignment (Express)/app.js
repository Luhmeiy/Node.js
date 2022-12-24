const express = require('express');

const app = express();

app.use('/users', (req, res) => {
    console.log("You are now seeing the users.");
    res.send('<h1>The "Users" Page</h1>');
})

app.use('/', (req, res) => {
    console.log("Hello, user.");
    res.send('<h1>Hello, user!</h1>');
})

app.listen(3000);