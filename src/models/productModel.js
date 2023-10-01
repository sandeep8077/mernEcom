import mongoose from "mongoose"

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,

    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    categorie: {
        type: mongoose.ObjectId,
        ref: 'categorie',
        requierd: true,
    },
    quantity: {
        type: Number,
        required: true
    },
    photo: {
        data: Buffer,
        contentType: String,

    },
    shipping: {
        type: Boolean
    }
}, { timestamps: true });

export default mongoose.model('product', ProductSchema);