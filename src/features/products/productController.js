import slugify from "slugify"
import productModel from "../../models/productModel.js"
import fs from 'fs'

import categorieModel from "../../models/categorieModel.js";
import braintree from "braintree";
import ordersModel from "../../models/ordersModel.js";
import dotenv from 'dotenv'



dotenv.config();




// create product 
export const createProduct = async(req, res) => {
    try {
        const { photo } = req.files;
        const { name } = req.fields;
        const product = new productModel({...req.fields, slug: slugify(name) });
        if (photo) {
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = (photo.type);

        }
        await product.save();
        return res.status(201).send({
            success: true,
            message: 'product created successfully',
            product
        })

    } catch (error) {
        // console.log(error);
        return res.status(500).send({
            success: false,
            message: 'error to create product',
            error
        })
    }


}

// get all products

export const getAllProducts = async(req, res) => {

    try {
        const products = await productModel.find({}).populate('categorie').select('-photo').limit(12).sort({ createdAt: -1 });
        return res.status(200).send({
            success: true,
            message: 'get all prodcuts successfully',
            TotalCount: products.length,
            products
        })

    } catch (error) {
        // console.log(error);
        return res.status(500).send({
            success: false,
            message: 'error to get all products',
            error: error.message
        })

    }

}

// get single product
export const getSigleProduct = async(req, res) => {
    try {
        const { slug } = req.params;
        const product = await productModel.findOne({ slug }).select('-photo').populate('categorie');
        return res.status(200).send({
            success: true,
            message: 'get successfully single product',
            product
        })

    } catch (error) {
        // console.log(error);
        return res.status(500).send({
            success: false,
            message: 'error to get single product',
            error,
        });

    }
}

// get photo of product

export const getPhoto = async(req, res) => {
    try {
        const { pid } = req.params;
        const product = await productModel.findById(pid).select('photo');
        if (product.photo.data) {
            res.set('content-type', product.photo.contentType);
            return res.send(product.photo.data);
        }


    } catch (error) {
        // console.log(error);
        return res.status(500).send({
            success: false,
            message: 'error to get photo',
            error
        })

    }

}

// delete product

export const deleteProduct = async(req, res) => {
    try {
        const { pid } = req.params;
        const product = await productModel.findByIdAndDelete(pid).select('-photo');
        return res.send({
            success: true,
            message: 'products deleted successfully'
        })

    } catch (error) {
        // console.log('error to delete product');
        return res.status(500).send({
            success: false,
            message: 'error to remove product',
            error
        });

    }

}

//update product
export const productUpdate = async(req, res) => {
    try {
        const { name } = req.fields;
        const { photo } = req.files;
        const { pid } = req.params;

        const product = await productModel.findByIdAndUpdate(pid, {...req.fields, slug: slugify(name) }, { new: true });
        if (photo) {
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = (photo.type);

        }
        await product.save();
        return res.status(201).send({
            success: true,
            message: 'product updated successfully',
            product,
        })


    } catch (error) {
        // console.log(error);
        return res.status(500).send({
            success: false,
            message: 'error to update product',
            error
        })
    }

}

// fitler Product
export const filterProducts = async(req, res) => {
    try {
        const { checked, radio } = req.body;

        const args = {};
        if (checked.length > 0) args.categorie = { $in: checked };
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] }
            // console.log(arg);
            // const { ids } = req.body;

        const prodcuts = await productModel.find(args).select('-photo');

        if (!prodcuts) {
            return res.status(401).send({ success: false, message: 'this fillers products not avalable' })
        }
        console.log(prodcuts)

        const count = prodcuts.length;
        return res.status(200).send({
            success: true,
            totel_count: count,
            messege: 'filter products successfully',
            prodcuts
        })

    } catch (error) {
        return res.status(500).send({
            success: false,
            message: 'error to filter data'
        })
    }


}

// get total count 
export const getTotal = async(req, res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount();
        return res.status(200).send({
            success: true,
            message: 'successfully get total documents',
            total
        })

    } catch (error) {
        // console.log(error);
        return res.status(500).send({
            success: false,
            message: 'error to get total',
            error
        })

    }
}

// get products based on page
export const getProductBasedOnPage = async(req, res) => {
    try {
        const perpage = 6;
        const page = req.params.page || 1;
        const products = await productModel.find({}).select('-photo').skip((page - 1) * perpage).limit(perpage).sort({ createdAt: -1 })
        return res.status(200).send({
            success: true,
            products
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'error to find pegination product',
            error,
        })
    }
}



// get products based on the searches

export const getSearchProducts = async(req, res) => {

    try {
        const { keyword } = req.params;
        const result = await productModel.find({
            $or: [
                { name: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } }
            ]
        }).select('-photo');

        return res.status(200).send({
            success: true,
            message: 'successfully search results',
            result,
        })

    } catch (error) {
        // console.log('error to  search elements', error);
        return res.status(500).send({
            success: false,
            message: 'error to find search products'
        })

    }
}

// get similar products base on category 
export const getSimilarProducts = async(req, res) => {
    try {
        const { pid, cid } = req.params;

        const similarProduct = await productModel.find({
            categorie: cid,
            _id: { $ne: pid },
        }).select('-photo').limit(3).populate('categorie');

        if (similarProduct) {
            return res.status(200).send({
                success: true,
                message: 'successfully find similar products',
                similarProduct,
            })
        } else {
            return res.status(401).send({
                success: false,
                message: 'similar product is not found'
            })

        }


    } catch (error) {
        // console.log(error);
        return res.status(500).send({
            success: false,
            message: 'error to find similar product',
            error
        })
    }
}


// get products categorie wise
export const getProductsCategoriesWise = async(req, res) => {
    try {
        const categorie = await categorieModel.find({ slug: req.params.slug });
        const products = await productModel.find({ categorie }).populate('categorie').select('-photo');
        return res.status(200).send({
            success: true,
            message: 'successfully find products categorie wise',
            products,
            categorie
        })

    } catch (error) {
        // console.log(error);
        return res.status(500).send({
            success: false,
            message: 'error to find product categorie wise',
            error
        })

    }
}


// // payment gatway
const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHENT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

// payment getway api
// token controller
export const braintreeTokenController = async(req, res) => {
    try {
        gateway.clientToken.generate({}, function(err, result) {
            if (err) {
                return res.send(err);
            } else {
                return res.send(result)
            }

        })

    } catch (error) {
        // console.log(error);


    }



}

//payment controller
export const braintreePaymentController = async(req, res) => {
    try {
        const { cart, nonce } = req.body;
        let total = 0;
        cart.map(t => (total = Number(total + t.price)));
        const newTransaction = gateway.transaction.sale({
                amount: total,
                paymentMethodNonce: nonce,
                options: {
                    submitForSettlement: true,
                },
            },
            function(err, result) {
                if (result) {
                    const orders = new ordersModel({
                        products: cart,
                        payments: result,
                        buyer: req.user._id

                    }).save();
                    return res.send({ ok: true })
                } else {
                    return res.status(500).send(error);
                }
            }
        )

    } catch (error) {
        // console.log(error)

    }


}