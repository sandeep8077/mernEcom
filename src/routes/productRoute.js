import express from 'express';
import {
    braintreePaymentController,
    braintreeTokenController,
    createProduct,
    deleteProduct,
    filterProducts,
    getAllProducts,
    getPhoto,
    getProductBasedOnPage,
    getProductsCategoriesWise,
    getSearchProducts,
    getSigleProduct,
    getSimilarProducts,
    getTotal,
    productUpdate
} from '../features/products/productController.js';
import { isAdmin, protectRoute } from '../middleware/protectedRouteMiddleware.js';
import formidable from 'express-formidable'
import { productValidation } from '../middleware/productValidationMiddleware.js';
import {get } from 'mongoose';

const productRouter = express.Router();

// create product route
productRouter.post('/create-product', protectRoute, isAdmin, formidable(), productValidation, createProduct);

// get all products
productRouter.get('/get-allProducts', getAllProducts);

// get single product
productRouter.get('/get-singleProduct/:slug', getSigleProduct);

//get product photo
productRouter.get('/get-photo/:pid', getPhoto);

//remove products
productRouter.delete('/delete-product/:pid', deleteProduct)

//update product 
productRouter.put('/update-product/:pid', protectRoute, isAdmin, formidable(), productValidation, productUpdate);

//filter prododuct
productRouter.post('/filter-product/', filterProducts);

// get total documents 
productRouter.get('/get-total', getTotal);

// product  list based on page;
productRouter.get('/product-list/:page', getProductBasedOnPage);

// get product based on search keyword
productRouter.get('/search/:keyword', getSearchProducts)

// get similar product route
productRouter.get('/similar-product/:pid/:cid', getSimilarProducts);

// get products categories wise 
productRouter.get('/products-categorie/:slug', getProductsCategoriesWise);

// payment routes
//token
productRouter.get('/braintree/token', braintreeTokenController);

// // payment
productRouter.post('/braintree/payment', protectRoute, braintreePaymentController);




export default productRouter;