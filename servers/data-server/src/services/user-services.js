import bcrypt from 'bcrypt';
import User from "../models/User.js";

async function register(bodyData) {
    const { email, password, rePass, ...profileData } = bodyData;

    const userData = {};
    userData.email = email;
    userData.password = password;
    userData.rePass = rePass;
    userData.profileData = profileData;

    if (userData.password !== userData.rePass) {
        return;
    }

    if(!userData.password) {
        return;
    }

    userData.password = await bcrypt.hash(userData.password, 13);

    return await User.create(userData);
}

const userServices = {
    register
}

export default userServices;