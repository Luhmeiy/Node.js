import Product from '../models/product.js';
import Order from '../models/order.js';

export function getProducts(req, res) {
    Product.find()
        .then(products => {
            res.render('shop/product-list', { 
                prods: products, 
                pageTitle: 'All Products', 
                path: '/products'
            });
        })
        .catch(err => console.log(err));
}

export function getProduct(req, res) {
    const prodId = req.params.productId;
    
    Product.findById(prodId)
        .then(product => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/products'
            });
        })
        .catch(err => console.log(err));
}

export function getIndex(req, res) {
    Product.find()
        .then(products => {
            res.render('shop/index', { 
                prods: products, 
                pageTitle: 'Shop', 
                path: '/'
            });
        })
        .catch(err => console.log(err));
}

export function getCart(req, res) {
    req.user
        .populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items;
            
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products
            });      
        })
        .catch(err => console.log(err));
}

export function postCart(req, res) {
    const prodId = req.body.productId;

    Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => res.redirect('/cart'))
        .catch(err => console.log(err));
}

export function postCartDeleteProduct(req, res) {
    const prodId = req.body.productId;

    req.user
        .removeFromCart(prodId)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
}

export function postOrder(req, res) {
    req.user
        .populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items.map(i => {
                return { 
                    quantity: i.quantity, 
                    product: { ...i.productId._doc }
                };
            });

            const order = new Order({
                products: products,
                user: {
                    name: req.user.name,
                    userId: req.user
                }
            });

            return order.save();
        })
        .then(result => {
            return req.user.clearCart();
        })
        .then(() => res.redirect('/orders'))
        .catch(err => console.log(err));
}

export function getOrders(req, res) {
    Order
        .find({ "user.userId": req.user._id })
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders: orders
            });
        })
        .catch(err => console.log(err));
}