import defaultAvatar from '/images/default-profile-avatar.png'

import api from '../utils/api.js';

const userUpdatePayload = {
    validationData: {},
    newValues: {},
}

async function handleRegister(data, setIsUser) {
    const userId = await api.post('/register', data);

    setIsUser(userId);
}

async function handleLogin(data, setIsUser) {
    const userId = await api.post('/login', data);

    setIsUser(userId);
}

async function handleLogout(setIsUser) {
    await api.get('/logout');

    setIsUser(false);
}

async function handleUserDataWithPosts(userId, abortSignal) {
    const userData = await api.get(`/users/${userId}/with-posts`, { signal: abortSignal });

    userData.imageUrl = userData.imageUrl ? userData.imageUrl : defaultAvatar;

    return userData;
}

async function handleGetAllWithMatchingNames(searchParam, abortSignal) {
    const matchedUsers = await api.get(`/users/search?name=${searchParam}`, { signal: abortSignal });

    matchedUsers
        .reverse()
        .map(user => user.imageUrl = user.imageUrl ? user.imageUrl : defaultAvatar);

    return matchedUsers;
}

async function handleUpdateUserData(userId, payload) {
    await api.put(`/users/${userId}`, payload);
}

async function handleGetUserFields(userId, fields, abortSignal) {
    const userData = await api.get(`/users/${userId}/fields?${fields}`, { signal: abortSignal });

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

async function handleGetUserData(userId, abortSignal) {
    const user = await api.get(`/users/${userId}`, { signal: abortSignal });
    user.imageUrl = user.imageUrl || defaultAvatar;

    return user;
}

const userServices = {
    handleGetAllWithMatchingNames,
    handleUserDataWithPosts,
    handlePasswordChange,
    handleUpdateUserData,
    handleGetUserFields,
    handleGetUserData,
    handleEmailChange,
    handleRegister,
    handleLogout,
    handleLogin,
}

export default userServices;