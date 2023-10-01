import mongoose from "mongoose";
const connectDB = async() => {
    try {
        const connection = await mongoose.connect(process.env.DATA_BASE);
        console.log('database connected to successfully');
    } catch (err) {
        console.log('Error to connect database', err);
    }

}
export default connectDB;