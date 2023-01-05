import Product from '../models/product.js';

export function getAddProduct(req, res) {
    res.render('admin/edit-product', { 
        pageTitle: 'Add Product', 
        path: '/admin/add-product',
        editing: false
    });
}

export function postAddProduct(req, res) {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;

    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: req.user
    });

    product
        .save()
        .then(result => {
            console.log('Created Product.');
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
}

export function getEditProduct(req, res) {
    const editMode = req.query.edit;

    if (!editMode) res.redirect('/');

    const prodId = req.params.productId;

    Product.findById(prodId)
        .then(product => {

            if (!product) res.redirect('/');
    
            res.render('admin/edit-product', { 
                pageTitle: 'Edit Product', 
                path: '/admin/edit-product',
                editing: editMode,
                product: product
            });
        })
        .catch(err => console.log(err));
}

export function postEditProduct(req, res) {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedDesc = req.body.description;
    const updatedImageUrl = req.body.imageUrl;

    Product.findById(prodId)
        .then(product => {
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDesc;
            product.imageUrl = updatedImageUrl;
            return product.save();
        })
        .then(result => {
            console.log('Updated Product.');
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
}

export function postDeleteProduct(req, res) {
    const prodId = req.body.productId;

    Product.findByIdAndRemove(prodId)
        .then(result => {
            console.log('Deleted Product.')
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
}

export function getProducts(req, res) {
    Product.find()
        .then(products => {
            res.render('admin/products', { 
                prods: products, 
                pageTitle: 'Admin Products', 
                path: '/admin/products'
            });
        })
        .catch(err => console.log(err));
}