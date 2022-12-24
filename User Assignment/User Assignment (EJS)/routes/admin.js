const express = require('express');

const router = express.Router();

const users = [];

router.get('/add-user', (req, res) => {
    res.render('add-user', {
        pageTitle: 'Add User', 
        path: '/admin/add-user'
    })
})

router.post('/add-user', (req, res) => {
    users.push({ username: req.body.username });
    res.redirect('/');
})

exports.routes = router;
exports.users = users;