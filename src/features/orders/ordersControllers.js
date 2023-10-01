import ordersModel from "../../models/ordersModel.js"


// get orders for user
export const getOrdersController = async(req, res) => {
    try {

        const orders = await ordersModel.find({ buyer: req.user._id }).populate('products', '-photo').populate('buyer', 'name')
        return res.status(200).send({
            success: true,
            messaage: 'successfully find orders details',
            orders
        })
    } catch (error) {
        // console.log(error)
        return res.status(500).send({
            success: false,
            message: 'error to find orders',
            error
        })

    }
}

// get all orders for admin
export const allorders = async(req, res) => {
    try {
        const allOrders = await ordersModel.find({}).populate('products', '-photo').populate('buyer', 'name').sort({ createdAt: '-1' })
        return res.status(200).send({
            success: true,
            message: 'successfully get all orders',
            allOrders
        })

    } catch (error) {
        // console.log(error);
        return res.status(500).send({
            success: false,
            message: 'error to get all orders',
            error
        })
    }
}

// update orders status
export const updatStatus = async(req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const orders = await ordersModel.findByIdAndUpdate(orderId, { status });
        res.status(200).send({
            success: true,
            message: 'status updated successfully',
            orders
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'error to update status',
            error
        })
    }
}