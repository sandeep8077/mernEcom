import bcrypt from 'bcrypt';

export const hashPassword = async(password) => {
    try {
        const saltRound = 10;
        const hashedPassword = await bcrypt.hash(password, saltRound)
        return hashedPassword;
    } catch (error) {
        console.log('error to password hash', error);

    }

}

export const comparPasssword = async(password, hashedPassword) => {

    return await bcrypt.compare(password, hashedPassword);

}