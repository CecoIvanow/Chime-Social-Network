import bcrypt from 'bcrypt';

import User from "../models/User.js";
import { userTokenCreation } from '../utils/token-utils.js';
import { emailMasking, passwordParamsRemover } from '../utils/data-sanitization-utils.js';
import { escapeRegex } from '../utils/regex-utils.js';
import { ageCalculator, memberSinceDateConverter, postedOnDateConverter } from '../utils/date-time-utils.js';

const COMMONLY_NEEDED_PARAMS = 'firstName lastName createdPosts createdAt imageUrl friends'
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

    const user = await User.findOne({ email: loginData.email }).select('email password _id').lean();

    if (!user) {
        throw new Error("Invalid email or password!");
    }

    const isPasswordValid = await bcrypt.compare(loginData.password, user.password);

    if (!isPasswordValid) {
        throw new Error("Invalid email or password!");
    }

    const token = userTokenCreation(user);
    const { _id } = user;

    return [token, _id];
}

async function getUserAndPopulatePosts(userId) {
    const user = await User
        .findById(userId)
        .select('-password -email')
        .populate({
            path: 'createdPosts',
            populate: {
                path: 'owner',
                select: 'firstName lastName imageUrl'
            }
        })
        .lean();

    user.memberSince = memberSinceDateConverter(user.createdAt);
    user.age = ageCalculator(user.birthday);
    user.createdPosts.map(post => post.postedOn = postedOnDateConverter(post.createdAt));

    return user
}

async function getUserData(userId) {
    const user = await User
        .findById(userId)
        .select('-createdPosts -email -password -createdAt -friends')
        .lean();

    return user;
}

async function attachPostToUser(ownerId, postId) {
    const user = await User.findById(ownerId);

    user.createdPosts.push(postId);

    await user.save();
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

    const user = await User.findById(userId)
        .select(newParams)
        .lean()

    if (user.email) {
        user.email = emailMasking(user.email);
    }

    return user
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

    let user = await User.findOne({ _id: userId, email: data.validationData.curEmail });

    if (!user) {
        throw new Error('Invalid data!');
    }

    const isPasswordValid = await bcrypt.compare(data.validationData.curPass, user.password);

    if (!isPasswordValid) {
        throw new Error('Invalid data!')
    }

    if (data.newValues.hasOwnProperty('email')) {
        user.email = data.newValues.email;

    } else if (data.newValues.hasOwnProperty('newPass')) {
        const newHashedPass = await bcrypt.hash(data.newValues.newPass, SALT_ROUNDS);

        user.password = newHashedPass;

    } else {
        throw new Error('Invalid credentials to be changed!');

    }

    await user.save();
}

async function removePost(userId, postId) {
    const user = await User.findById(userId);

    user.createdPosts = user.createdPosts.filter(post => post.toString() !== postId);

    await user.save();
}

async function updateUserData(userId, data) {
    await User.findByIdAndUpdate(userId, data);
}

async function addFriend(userId, newFriendId) {
    const user = await User.findById(userId);

    if (user.friends.includes(newFriendId)) {
        throw new Error("Already added as friends!");
    }

    user.friends.push(newFriendId);

    await user.save();
}

async function removeFriend(userId, friendId) {
    const user = await User.findById(userId);

    user.friends = user.friends.filter(friend => friend.toString() !== friendId);

    await user.save();
}

const userRepositories = {
    changeAccountCredentials,
    getUserAndPopulatePosts,
    getAllWithMatchingNames,
    getFriendsWithPosts,
    attachPostToUser,
    updateUserData,
    getUserFields,
    removeFriend,
    getUserData,
    removePost,
    addFriend,
    register,
    login,
}

export default userRepositories;