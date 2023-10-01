import express from 'express';
import { authRegister, loginUser, resetPassword, testUser, updateUserProfile } from '../features/users/authController.js';
import { userValidation } from '../middleware/validationMiddlware.js';
import { isAdmin, protectRoute } from '../middleware/protectedRouteMiddleware.js';

const authRouter = express.Router();
//reset password route
authRouter.post('/reset-password', resetPassword);

// register use route
authRouter.post('/register', userValidation, authRegister);

// login user route
authRouter.post('/login', loginUser);

//check user exist or not and admin or not 
authRouter.get('/test', protectRoute, isAdmin, testUser);

// user auth route
authRouter.get('/auth-user', protectRoute, (req, res) => {
        res.status(200).send({
            ok: true,
        })
    })
    //admin auth route
authRouter.get('/auth-admin', protectRoute, isAdmin, (req, res) => {
    res.status(200).send({
        ok: true,
    })
});

//update user route
authRouter.put('/update-user', protectRoute, updateUserProfile);
export default authRouter;