import api from '../utils/api.js';

import { storage } from '../firebase/firebase-storage/config.js';
import { ref, getDownloadURL } from 'firebase/storage';

const userUpdatePayload = {
    validationData: {},
    newValues: {},
}

async function handleRegister(data, helpers = {}) {
    const defaultAvatarRef = ref(storage, '/images/default/default-profile-avatar.png');
    const defaultAvatarUrl = await getDownloadURL(defaultAvatarRef);

    data.imageUrl = defaultAvatarUrl;

    const { error, userId } = await api.post('/register', data);

    if (error) {
        helpers.setAlert(error);
        return;
    }

    helpers.setIsUser(userId);
}

async function handleLogin(data, helpers = {}) {
    const { error, userId } = await api.post('/login', data);

    if (error) {
        helpers.setAlert(error);
        return;
    }

    helpers.setIsUser(userId);
}

async function handleLogout(setIsUser) {
    setIsUser(false);
}

async function handleUserDataWithPosts(userId, helpers = {}) {
    const { error, userData } = await api.get(`/users/${userId}/with-posts`, { signal: helpers.abortSignal });

    if (error) {
        helpers.setAlert(error);
        return;
    }

    return userData;
}

async function handleGetAll(helpers = {}) {
    const { error, users } = await api.get('/users', { signal: helpers.abortSignal });

    if (error) {
        helpers.setAlert(error);
        return;
    }

    users.reverse()

    return users;
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

    return user;
}

async function handleAddFriend(userId, newFriendId) {
    await api.patch(`/users/${userId}/friends`, { newFriendId });
}

async function handleUnfriend(userId, friendId) {
    await api.delete(`/users/${userId}/friends/${friendId}`);
}

async function handleGetUserWithFriendsAndPosts(userId, abortSignal) {
    const data = await api.get(`/users/${userId}/full-profile`, { signal: abortSignal });

    return data;
}

const userServices = {
    handleGetUserWithFriendsAndPosts,
    handleGetAll,
    handleUserDataWithPosts,
    handleUpdateUserData,
    handlePasswordChange,
    handleGetUserFields,
    handleGetUserData,
    handleEmailChange,
    handleAddFriend,
    handleUnfriend,
    handleRegister,
    handleLogout,
    handleLogin,
}

export default userServices;