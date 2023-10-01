import express from "express";
import dotenv from 'dotenv';
import connectDB from "./src/config/mongoose.js";
import authRouter from "./src/routes/authRoute.js";
import categorieRouter from "./src/routes/categorieRoute.js";
import cors from 'cors'
import productRouter from "./src/routes/productRoute.js";
import orderRouter from "./src/routes/orderRoute.js";
import path from 'path';
import { fileURLToPath } from 'url';




const server = express();
// config
dotenv.config();
connectDB();

// es module fix
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

//middlwares
server.use(cors());
server.use(express.json());
server.use(express.static(path.join(__dirname, './client_ecom/build')))


// api 
server.use('/api/v1/auth', authRouter);
server.use('/api/v1/categorie', categorieRouter);
server.use('/api/v1/product', productRouter);
server.use('/api/v1/order', orderRouter);


server.use('*', function(req, res) {
    res.sendFile(path.join(__dirname, './client_ecom/build/index.html'));
})
const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
    console.log(`server is running on port no ${PORT}`);
})