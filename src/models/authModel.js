import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: 0
    }

}, { timestamps: true })

export default mongoose.model('users', authSchema);