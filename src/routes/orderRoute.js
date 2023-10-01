import express from "express";
import { allorders, getOrdersController, updatStatus } from "../features/orders/ordersControllers.js";
import { isAdmin, protectRoute } from "../middleware/protectedRouteMiddleware.js";

const orderRouter = express.Router();
// get specific user orders route
orderRouter.get('/get-orders', protectRoute, getOrdersController);

// get all orders for admin
orderRouter.get('/get-allorders', protectRoute, isAdmin, allorders);

// update status of the product route
orderRouter.put('/update-status/:orderId', protectRoute, isAdmin, updatStatus);


export default orderRouter;