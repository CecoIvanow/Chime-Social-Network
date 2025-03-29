import api from '../utils/api.js';

import { storage } from '../firebase/firebase-storage/config.js';
import { ref, getDownloadURL } from 'firebase/storage';

const userUpdatePayload = {
    validationData: {},
    newValues: {},
}

async function handleRegister(data, setIsUser) {
    const defaultAvatarRef = ref(storage, '/images/default/default-profile-avatar.png');
    const defaultAvatarUrl = await getDownloadURL(defaultAvatarRef);

    data.imageUrl = defaultAvatarUrl;

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

    return userData;
}

async function handleGetAllWithMatchingNames(searchParam, abortSignal) {
    const matchedUsers = await api.get(`/users/search?name=${searchParam}`, { signal: abortSignal });

    matchedUsers.reverse()

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

    return user;
}

async function handleAddFriend(userId, newFriendId) {
    await api.patch(`/users/${userId}/add-friend`, { newFriendId });
}

const userServices = {
    handleGetAllWithMatchingNames,
    handleUserDataWithPosts,
    handleUpdateUserData,
    handlePasswordChange,
    handleGetUserFields,
    handleGetUserData,
    handleEmailChange,
    handleAddFriend,
    handleRegister,
    handleLogout,
    handleLogin,
}

export default userServices;