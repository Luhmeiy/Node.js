const express = require('express');

const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res) => {
    const users = adminData.users;

    res.render('users', {
        users: users, 
        pageTitle: 'Users',
        path: '/'
    })
})

module.exports = router;