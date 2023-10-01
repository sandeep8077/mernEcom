import authModel from "../../models/authModel.js";
import { comparPasssword, hashPassword } from "../../helper/authHelper.js";
import jwt from 'jsonwebtoken';

// register  user
export const authRegister = async(req, res) => {
    try {
        const { name, email, password, address, mobile, answer } = req.body;
        //check user already exist  
        const userExist = await authModel.findOne({ email });
        if (userExist) {
            return res.status(201).send({
                success: false,
                message: 'user already exist',

            })
        }
        const hashedPassword = await hashPassword(password);
        const user = await new authModel({ name, email, password: hashedPassword, address, mobile, answer }).save();
        return res.status(201).send({
            success: true,
            message: 'user registered successfully',
            user
        })
    } catch (err) {
        // console.log('error to create user', err);

    }
}


// login user
export const loginUser = async(req, res) => {
    try {
        const { email, password } = req.body;
        //validation
        if (!email) {
            res.send('email is required');
        }
        if (!password) {
            res.send('password is required');
        }
        //check user 
        const user = await authModel.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'user not registered'
            })
        }
        const isMatch = await comparPasssword(password, user.password);
        if (!isMatch) {
            return res.status(201).send({
                success: false,
                message: 'Invalid password',
            })
        }

        const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
        return res.status(201).send({
            success: true,
            message: 'user successfully logedIn',
            loginUser: {
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                address: user.address,
                role: user.role

            },
            token

        })


    } catch (error) {
        // console.log('Error to find user for login', error);
        res.status(404).send({
            success: false,
            message: 'user not found ',
            error
        })

    }

}

//forgot password functionality
export const resetPassword = async(req, res) => {
    try {
        const { email, answer, newpassword } = req.body;
        if (!email) {
            return res.status(400).send({
                message: 'email is reqired',
            })
        }
        if (!answer) {
            return res.status(400).send({
                message: 'answer is reqired',
            })
        }
        if (!newpassword) {
            return res.status(400).send({
                message: 'password is reqired',
            })
        }

        const user = await authModel.findOne({ email, answer });
        if (!user) {
            return res.status(400).send({
                success: false,
                message: 'email and answer incorrect'
            })

        }
        const hashedPassword = await hashPassword(newpassword);
        authModel.findByIdAndUpdate(user._id, { password: hashedPassword });
        res.status(201).send({
            success: true,
            message: 'password reset Successfully'
        })

    } catch (error) {
        // console.log(error);
        res.status(500).send({
            success: false,
            message: 'something went wrong',
            error,

        })

    }
}

export const testUser = (req, res) => {
    console.log('user is protected');
    res.status(200).send({
        success: true,
        message: 'user is protected',
    })
}


// update user 
export const updateUserProfile = async(req, res) => {
    try {
        const { name, password, address, mobile } = req.body;
        // console.log('this is a password', password, name, address, mobile);
        const user = await authModel.findById(req.user._id);

        if (password && password.length < 6) {
            return res.send({ message: 'password length should be greater 6' });
        }
        const hashedPassword = password ? await hashPassword(password) : undefined;
        const updateUser = await authModel.findByIdAndUpdate(req.user._id, {
            name: name || user.name,
            password: hashedPassword || user.password,
            mobile: mobile || user.mobile,
            address: address || user.address,

        }, { new: true });
        // console.log(updateUser);
        return res.status(200).send({
            success: true,
            message: 'profile updated successfully',
            updateUser
        });


    } catch (error) {
        // console.log(error)
        return res.status(500).send({
            success: false,
            message: 'error to update user',
            error
        })

    }

}