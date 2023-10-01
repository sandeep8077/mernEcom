import jwt from 'jsonwebtoken';
import authModel from '../models/authModel.js';
export const protectRoute = async(req, res, next) => {
    try {
        const decode = await jwt.verify(req.headers.authorization, process.env.SECRET_KEY);
        // console.log('this is decode', decode);
        req.user = decode;
        console.log('protect hora h route')
        next();


    } catch (error) {
        console.log(error);
        return res.status(404).send({
            success: false,
            message: 'user is not authrized',
            error
        })

    }


}

export const isAdmin = async(req, res, next) => {
    try {
        const user = await authModel.findById(req.user._id);
        if (user.role !== 1) {
            res.status(404).send({
                success: false,
                message: 'not admin',
            })
        }
        console.log('admin bhi chaek hore h')
        next();

    } catch (error) {
        console.log(error);
        res.status(404).send({
            success: false,
            message: 'something went wrong',
            error

        })

    }

}