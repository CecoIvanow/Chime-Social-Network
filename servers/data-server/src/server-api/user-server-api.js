import bcrypt from 'bcrypt';
import User from "../models/User.js";
import { userTokenCreation } from '../utils/token-utils.js';

async function register(data) {
    const userData = data;

    for (const data in userData) {
        if (!userData[data]) {
            throw new Error(`Empty field found!`);
        }
    }

    if (userData.password !== userData.rePass) {
        throw new Error("Passwords do not match!");
    }

    const isEmailUsed = await User.findOne({ email: userData.email }).select('email').lean();

    if (isEmailUsed) {
        throw new Error("A user with this email already exists!");
    }

    userData.password = await bcrypt.hash(userData.password, 13);

    const newUser = await User.create(userData);

    const token = userTokenCreation(newUser);
    const { _id } = newUser;

    return [token, _id];

}

const userServerApi = {
    register
}

export default userServerApi;