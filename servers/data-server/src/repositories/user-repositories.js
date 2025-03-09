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

async function login(data) {
    const loginData = data;

    const foundUser = await User.findOne({ email: loginData.email }).select('email password _id').lean();

    if (!foundUser) {
        throw new Error("Invalid email or password!");
    }

    const isPasswordValid = await bcrypt.compare(loginData.password, foundUser.password);

    if (!isPasswordValid) {
        throw new Error("Invalid email or password!");
    }

    const token = userTokenCreation(foundUser);
    const { _id } = foundUser;

    return [token, _id];
}

async function fetchOne(userId) {
    return await User.findById(userId).select('-password -updatedAt -email -friends');
}

const userRepositories = {
    register,
    fetchOne,
    login,
}

export default userRepositories;