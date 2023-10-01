import mongoose from "mongoose";

const categorieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,


    }
}, { timestamps: true })

export default mongoose.model('categorie', categorieSchema);