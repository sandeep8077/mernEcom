export const userValidation = (req, res, next) => {
    const { name, email, password, address, mobile } = req.body;
    if (!name) {
        res.send('Name is required');
    }
    if (!email) {
        res.send('email is required');
    }
    if (!password) {
        res.send('password is required');
    }
    if (!address) {
        res.send('address is required');
    }
    if (!mobile) {
        res.send('mobile is required')
    }

    next();



}