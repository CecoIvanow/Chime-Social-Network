import bcrypt from 'bcrypt';

import User from "../models/User.js";
import { userTokenCreation } from '../utils/token-utils.js';
import { emailMasking, passwordParamsRemover } from '../utils/data-sanitization-utils.js';
import { escapeRegex } from '../utils/regex-utils.js';
import { ageCalculator, memberSinceDateConverter, postedOnDateConverter } from '../utils/date-time-utils.js';

const COMMONLY_NEEDED_PARAMS = 'firstName lastName createdPosts createdAt imageUrl'
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 13;

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

    userData.password = await bcrypt.hash(userData.password, SALT_ROUNDS);

    // The line below offsets the time with 2+ hours as new Date() is 2 hours behind;
    const creationTime = new Date(Date.now() - new Date().getTimezoneOffset() * 60000);
    userData.createdAt = creationTime;

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

async function getUserAndPopulatePosts(userId) {
    const userData = await User
        .findById(userId)
        .select(`${COMMONLY_NEEDED_PARAMS} birthday gender`)
        .populate('createdPosts')
        .lean();

    userData.memberSince = memberSinceDateConverter(userData.createdAt);
    userData.age = ageCalculator(userData.birthday);
    userData.createdPosts.map(post => post.postedOn = postedOnDateConverter(post.createdAt));

    return userData
}

async function getUserData(userId) {
    const userData = await User
    .findById(userId)
    .select('-createdPosts -email -password -createdAt -friends')
    .lean();

    return userData;
}

async function attachPostToUser(ownerId, postId) {
    const userPosts = await User.findById(ownerId);

    userPosts.createdPosts.push(postId);

    await userPosts.save();
}

async function getAllWithMatchingNames(filter) {
    const escapedFilter = escapeRegex(filter);

    const nameRegex = new RegExp(escapedFilter, 'i');

    const matchedUsers = await User
        .find({})
        .or([
            { firstName: nameRegex },
            { lastName: nameRegex },
        ])
        .select(COMMONLY_NEEDED_PARAMS)
        .lean();

    matchedUsers.map(user => user.memberSince = memberSinceDateConverter(user.createdAt))

    return matchedUsers;
}

async function getUserFields(userId, params) {
    let newParams = params;

    if (params.includes('password')) {
        newParams = passwordParamsRemover(params);
    }

    const userData = await User.findById(userId)
        .select(newParams)
        .lean()

    if (userData.email) {
        userData.email = emailMasking(userData.email);
    }

    return userData
}

async function changeAccountCredentials(userId, data) {
    const hasNewPassword = data.newValues.hasOwnProperty('newPass');
    const isNewPasswordRepeatValid = (data.newValues.newPass === data.validationData.rePass);
    const isOldPasswordRepeatValid = (data.validationData.curPass === data.validationData.rePass);

    if (hasNewPassword && !isNewPasswordRepeatValid) {
        throw new Error('New Passwords do not match!');
    } else if (!hasNewPassword && !isOldPasswordRepeatValid) {
        throw new Error('Old Passwords do not match!');
    }

    let foundUser = await User.findOne({ _id: userId, email: data.validationData.curEmail });

    if (!foundUser) {
        throw new Error('Invalid data!');
    }

    const isPasswordValid = await bcrypt.compare(data.validationData.curPass, foundUser.password);

    if (!isPasswordValid) {
        throw new Error('Invalid data!')
    }

    if (data.newValues.hasOwnProperty('email')) {
        foundUser.email = data.newValues.email;

    } else if (data.newValues.hasOwnProperty('newPass')) {
        const newHashedPass = await bcrypt.hash(data.newValues.newPass, SALT_ROUNDS);

        foundUser.password = newHashedPass;

    } else {
        throw new Error('Invalid credentials to be changed!');

    }

    await foundUser.save();
}

async function removePost(userId, postId) {
    const foundUser = await User.findById(userId);

    foundUser.createdPosts = foundUser.createdPosts.filter(post => post.toString() !== postId);

    await foundUser.save();
}

const userRepositories = {
    changeAccountCredentials,
    getUserAndPopulatePosts,
    getAllWithMatchingNames,
    attachPostToUser,
    getUserFields,
    getUserData,
    removePost,
    register,
    login,
}

export default userRepositories;