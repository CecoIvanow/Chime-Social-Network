import defaultAvatar from '../assets/images/default-profile-avatar.png'

import userApi from "../api/user-api.js";
import { ageCalculator, memberSinceDateConverter, postedOnDateConverter } from "../utils/date-time-utils.js";

async function handleRegister(data, setIsUser) {
    const userId = await userApi.register(data);

    setIsUser(userId);
}

async function handleLogin(data, setIsUser) {
    const userId = await userApi.login(data);

    setIsUser(userId);
}

async function handleLogout(setIsUser) {
    await userApi.logout();

    setIsUser(false);
}

async function handleUserDataWithPosts(userId, abortSignal) {
    const userData = await userApi.retrieveUserWithPosts(userId, abortSignal);

    userData.imageUrl = userData.imageUrl ? userData.imageUrl : defaultAvatar;
    userData.memberSince = memberSinceDateConverter(userData.createdAt);
    userData.age = ageCalculator(userData.birthday);
    userData.createdPosts.map(post => post.postedOn = postedOnDateConverter(post.createdAt));

    return userData;
}

async function handleGetAll(abortSignal) {
    const allUsers = await userApi.getAll(abortSignal);
    
    allUsers.map(user => {
        user.memberSince = memberSinceDateConverter(user.createdAt)
        user.imageUrl = user.imageUrl ? user.imageUrl : defaultAvatar;

        return user;
    });

    return allUsers;
}

async function handleGetAllWithMatchingNames(searchParam, abortSignal) {
    const matchedUsers = await userApi.retrieveUsersByName(searchParam, abortSignal);

    matchedUsers.map(user => {
        user.memberSince = memberSinceDateConverter(user.createdAt)
        user.imageUrl = user.imageUrl ? user.imageUrl : defaultAvatar;

        return user;
    });

    return matchedUsers;
}

async function handleGetUserFields(userId, fields, abortSignal) {
    const userData = userApi.retrieveUserFields(userId, fields, abortSignal);

    return userData
}

const userServices = {
    handleGetAllWithMatchingNames,
    handleUserDataWithPosts,
    handleGetUserFields,
    handleRegister,
    handleLogout,
    handleGetAll,
    handleLogin,
}

export default userServices;