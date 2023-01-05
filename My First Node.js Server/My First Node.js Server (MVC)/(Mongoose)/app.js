import path, { join } from 'path';
import express from 'express';
import pkg from 'body-parser';
import { connect } from 'mongoose';

const { urlencoded } = pkg;

import get404 from './controllers/error.js';
import User from './models/user.js';

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

import adminRoutes from './routes/admin.js';
import shopRoutes from './routes/shop.js';

const __dirname = path.resolve();

app.use(urlencoded({extended: false}));
app.use(express.static(join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('63b5c231fff97b671c21da7f')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(get404);

connect('mongodb+srv://Medeiros:<password>@node-complete-cluster.bwsosjp.mongodb.net/shop?retryWrites=true&w=majority')
    .then(result => {
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: 'Luhmeiy',
                    email: 'Luhmeiy@test.com',
                    cart: {
                        items: []
                    }
                });

                user.save();
            }
        })

        app.listen(3000);
    })
    .catch(err => console.log(err));