import bcrypt from 'bcrypt';

import User from "../models/User.js";

import { userTokenCreation } from '../utils/token-utils.js';
import { emailMasking, passwordParamsRemover } from '../utils/data-sanitization-utils.js';
import { ageCalculator, memberSinceDateConverter } from '../utils/date-time-utils.js';

const COMMONLY_NEEDED_PARAMS = 'firstName lastName createdPosts createdAt imageUrl friends'
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 13;

async function register(data) {
    const userData = data;

    const userInstance = new User(userData);
    await userInstance.validate(userData);

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
    userData.memberSince = memberSinceDateConverter(creationTime);

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

    if (!user) {
        throw new Error("We couldn't locate your account. Please log in again.");
    }

    user.memberSince = memberSinceDateConverter(user.createdAt);
    user.age = ageCalculator(user.birthday);

    return user
}

async function getUserData(userId) {
    const user = await User
        .findById(userId)
        .select('-createdPosts -email -password -createdAt -friends')
        .lean();

    if (!user) {
        throw new Error("We couldn't locate your account. Please log in again.");
    }

    return user;
}

async function attachPostToUser(ownerId, postId) {
    const user = await User.findById(ownerId);

    if (!user) {
        throw new Error("We couldn't locate your account. Please log in again.");
    }

    user.createdPosts.push(postId);

    await user.save();
}

async function getUserFields(userId, params) {
    let searchParams = params;

    if (params.includes('password')) {
        searchParams = passwordParamsRemover(params);
    }

    const user = await User.findById(userId)
        .select(searchParams)
        .lean()

    if (!user) {
        throw new Error("We couldn't locate your account. Please log in again.");
    }

    if (user.email) {
        user.email = emailMasking(user.email);
    }

    return user
}

async function changeAccountCredentials(userId, data) {
    const rePass = data.validationData.rePass;
    const newPass = data.newValues.newPass;
    const curPass = data.validationData.curPass;
    const curEmail = data.validationData.curEmail;
    const newEmail = data.newValues.email;
    const hasNewPassword = !!newPass;
    const isNewPasswordRepeatValid = newPass === rePass;
    const isOldPasswordRepeatValid = curPass === rePass;

    if (!curEmail) {
        throw new Error("Current email field must be entered!");
    }

    if (!hasNewPassword && !newEmail) {
        throw new Error("New email field must be entered!");
    }

    if ((hasNewPassword && (!newPass || !rePass || !curPass)) ||
        (!hasNewPassword && (!curPass || !rePass))) {
        throw new Error('Password fields are missing values!');
    }

    if ((hasNewPassword && !isNewPasswordRepeatValid) ||
        (!hasNewPassword && !isOldPasswordRepeatValid)) {
        throw new Error('Repeat password does not match!');
    }

    let user = await User.findOne({ _id: userId, email: curEmail });

    if (!user) {
        throw new Error('Invalid email!');
    }

    const isPasswordValid = await bcrypt.compare(curPass, user.password);

    if (!isPasswordValid) {
        throw new Error('Invalid password!')
    }

    if (data.newValues.hasOwnProperty('email')) {
        user.email = newEmail;

    } else if (data.newValues.hasOwnProperty('newPass')) {
        const newHashedPass = await bcrypt.hash(newPass, SALT_ROUNDS);

        user.password = newHashedPass;

    } else {
        throw new Error('Invalid credentials!');

    }

    await user.save();

    return true;
}

async function removePost(userId, postId) {
    const user = await User
        .findById(userId)
        .select('createdPosts');

    if (!user) {
        throw new Error("We couldn't locate your account. Please log in again.");
    }

    user.createdPosts = user.createdPosts.filter(post => post.toString() !== postId);

    await user.save({ validateBeforeSave: false });
}

async function updateUserData(userId, data) {
    if (!data.firstName) {
        throw new Error("First name field must not be empty!");
    } else if (!data.lastName) {
        throw new Error("Last name field must not be empty!");
    } else if (!data.birthday) {
        throw new Error("Birthday field must not be empty!");
    }

    const user = await User.findByIdAndUpdate(userId, data);

    if (!user) {
        throw new Error("We couldn't locate your account. Please log in again.");
    }
}

async function addFriend(userId, newFriendId) {
    const [user, friend] = await Promise.all([
        User.findById(userId).select('friends'),
        User.findById(newFriendId).select('friends'),
    ])

    if (!user) {
        throw new Error("We couldn't locate your account. Please log in again.");
    }

    if (!friend) {
        throw new Error("We couldn't find the person you're trying to add. Please check if they exist and try again!");
    }

    if (user.friends.includes(newFriendId) || friend.friends.includes(userId)) {
        throw new Error("Already added as friends!");
    } else {
        user.friends.push(newFriendId);
        friend.friends.push(userId);
    }

    await Promise.all([
        user.save({ validateBeforeSave: false }),
        friend.save({ validateBeforeSave: false }),
    ])
}

async function removeFriend(userId, friendId) {
    const [user, friend] = await Promise.all([
        User.findById(userId).select('friends'),
        User.findById(friendId).select('friends'),
    ])

    if (!user) {
        throw new Error("We couldn't locate your account. Please log in again.");
    }

    if (!friend) {
        throw new Error("We couldn't find the person you're trying to add. Please check if they exist and try again!");
    }

    if (!user.friends.includes(friendId) || !friend.friends.includes(userId)) {
        throw new Error("Already removed as friends!");
    } else {
        user.friends = user.friends.filter(friend => friend.toString() !== friendId);
        friend.friends = friend.friends.filter(friend => friend.toString() !== userId);
    }

    await Promise.all([
        user.save({ validateBeforeSave: false }),
        friend.save({ validateBeforeSave: false }),
    ])
}

async function getFullProfileWithFriendsPosts(userId) {
    const user = await User
        .findById(userId)
        .select('-email -password')
        .populate({
            path: 'createdPosts',
            populate: {
                path: 'owner',
                select: 'firstName lastName imageUrl'
            }
        })
        .populate({
            path: 'friends',
            select: 'firstName lastName imageUrl createdPosts',
            populate: {
                path: 'createdPosts',
                populate: {
                    path: 'owner',
                    select: 'firstName lastName imageUrl',
                }
            }
        })
        .lean()

    if (!user) {
        throw new Error("We couldn't locate your account. Please log in again.");
    }

    user.memberSince = memberSinceDateConverter(user.createdAt);
    user.age = ageCalculator(user.birthday);

    return user;
}

async function getAll() {
    const users = await User
        .find({})
        .select('firstName lastName imageUrl createdPosts createdAt friends')
        .lean();

    users.map(user => user.memberSince = memberSinceDateConverter(user.createdAt))

    return users;
}

const userRepositories = {
    getFullProfileWithFriendsPosts,
    changeAccountCredentials,
    getUserAndPopulatePosts,
    attachPostToUser,
    updateUserData,
    getUserFields,
    removeFriend,
    getUserData,
    removePost,
    addFriend,
    register,
    getAll,
    login,
}

export default userRepositories;