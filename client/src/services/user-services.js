import defaultAvatar from '/images/default-profile-avatar.png'

import api from '../utils/api.js';
import { ageCalculator, memberSinceDateConverter, postedOnDateConverter } from "../utils/date-time-utils.js";

const userUpdatePayload = {
    validationData: {},
    newValues: {},
}

async function handleRegister(data, setIsUser) {
    const resp = await api.post('/register', data);
    const userId = await resp.json();

    setIsUser(userId);
}

async function handleLogin(data, setIsUser) {
    const resp = await api.post('/login', data);
    const userId = await resp.json();

    setIsUser(userId);
}

async function handleLogout(setIsUser) {
    await api.get('/logout');

    setIsUser(false);
}

async function handleUserDataWithPosts(userId, abortSignal) {
    const resp = await api.get(`/users/${userId}/with-posts`, abortSignal);
    const userData = await resp.json();

    userData.imageUrl = userData.imageUrl ? userData.imageUrl : defaultAvatar;
    userData.memberSince = memberSinceDateConverter(userData.createdAt);
    userData.age = ageCalculator(userData.birthday);
    userData.createdPosts.map(post => post.postedOn = postedOnDateConverter(post.createdAt));

    return userData;
}

async function handleGetAllWithMatchingNames(searchParam, abortSignal) {
    const resp = await api.get(`/users/search?name=${searchParam}`, abortSignal);
    const matchedUsers = await resp.json();

    matchedUsers
        .reverse()
        .map(user => {
            user.memberSince = memberSinceDateConverter(user.createdAt)
            user.imageUrl = user.imageUrl ? user.imageUrl : defaultAvatar;

            return user;
        });

    return matchedUsers;
}

async function handleGetUserFields(userId, fields, abortSignal) {
    const resp = await api.get(`/users/${userId}/fields?${fields}`, abortSignal);
    const userData = await resp.json();

    return userData
}

async function handleEmailChange(userId, submittedData) {
    const { newEmail, ...rest } = submittedData;

    userUpdatePayload.validationData = {
        ...rest
    };
    userUpdatePayload.newValues = {
        email: newEmail
    };

    await api.patch(`/users/${userId}/credentials`, userUpdatePayload);
}

async function handlePasswordChange(userId, submittedData) {
    const { newPass, ...rest } = submittedData;

    userUpdatePayload.validationData = {
        ...rest
    };
    userUpdatePayload.newValues = {
        newPass
    };

    await api.patch(`/users/${userId}/credentials`, userUpdatePayload);
}

const userServices = {
    handleGetAllWithMatchingNames,
    handleUserDataWithPosts,
    handlePasswordChange,
    handleGetUserFields,
    handleEmailChange,
    handleRegister,
    handleLogout,
    handleLogin,
}

export default userServices;