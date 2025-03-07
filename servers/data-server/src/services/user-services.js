import bcrypt from 'bcrypt';
import User from "../models/User.js";

async function register(data) {
    const userData = data;

    for (const data in userData) {
        if (!userData[data]) {
            throw new Error(`Empty field found!`);
        }
    }

    if (userData.password !== userData.rePass) {
        throw new Error("Passwords do not match");
    }

    const isEmailUsed = await User.findOne({ email: userData.email }).select('email').lean();
    
    if (isEmailUsed) {
        throw new Error("A user with this email already exists");
    }

    userData.password = await bcrypt.hash(userData.password, 13);

    return await User.create(userData);
}

const userServices = {
    register
}

export default userServices;