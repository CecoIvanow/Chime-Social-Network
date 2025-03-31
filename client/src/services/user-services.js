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

    const resp = await api.post('/register', data);

    if (resp.error) {
        helpers.setAlert(resp.error);
        return;
    }

    helpers.setIsUser(resp.userId);
}

async function handleLogin(data, helpers = {}) {
    const resp = await api.post('/login', data);

    if (resp.error) {
        helpers.setAlert(resp.error);
        return;
    }

    helpers.setIsUser(resp.userId);
}

async function handleLogout(setIsUser) {
    setIsUser(false);
}

async function handleUserDataWithPosts(userId, helpers = {}) {
    const resp = await api.get(`/users/${userId}/with-posts`, { signal: helpers.abortSignal });

    if (resp.error) {
        helpers.setAlert(resp.error);
        return;
    }

    return resp.userData;
}

async function handleGetAll(helpers = {}) {
    const resp = await api.get('/users', { signal: helpers.abortSignal });

    if (resp.error) {
        helpers.setAlert(resp.error);
        return;
    }

    resp.users.reverse()

    return resp.users;
}

async function handleUpdateUserData(userId, payload, helpers = {}) {
    const resp = await api.put(`/users/${userId}`, payload);

    if (resp?.error) {
        helpers.setAlert(resp.error);
        return;
    }
}

async function handleGetUserFields(userId, fields, helpers = {}) {
    const resp = await api.get(`/users/${userId}/fields?${fields}`, { signal: helpers.abortSignal });

    if (resp.error) {
        helpers.setAlert(resp.error);
        return;
    }

    return resp.userData;
}

async function handleEmailChange(userId, submittedData, helpers = {}) {
    const { newEmail, ...rest } = submittedData;

    userUpdatePayload.validationData = {
        ...rest
    };
    userUpdatePayload.newValues = {
        email: newEmail
    };

    const resp = await api.patch(`/users/${userId}/credentials`, userUpdatePayload);

    if (resp?.error) {
        helpers.setAlert(resp.error);
        return;
    }
}

async function handlePasswordChange(userId, submittedData, helpers = {}) {
    const { newPass, ...rest } = submittedData;

    userUpdatePayload.validationData = {
        ...rest
    };
    userUpdatePayload.newValues = {
        newPass
    };

    const resp = await api.patch(`/users/${userId}/credentials`, userUpdatePayload);

    if (resp?.error) {
        helpers.setAlert(resp.error);
        return;
    }
}

async function handleGetUserData(userId, helpers = {}) {
    const resp = await api.get(`/users/${userId}`, { signal: helpers.abortSignal });

    if (resp.error) {
        helpers.setAlert(resp.error);
        return;
    }

    return resp.userData;
}

async function handleAddFriend(userId, newFriendId, helpers = {}) {
    const resp = await api.patch(`/users/${userId}/friends`, { newFriendId });

    if (resp?.error) {
        helpers.setAlert(resp.error);
        return;
    }
}

async function handleUnfriend(userId, friendId, helpers = {}) {
    const resp = await api.delete(`/users/${userId}/friends/${friendId}`);

    if (resp?.error) {
        helpers.setAlert(resp.error);
        return;
    }
}

async function handleGetUserWithFriendsAndPosts(userId, helpers = {}) {
    const resp = await api.get(`/users/${userId}/full-profile`, { signal: helpers.abortSignal });

    if (resp.error) {
        helpers.setAlert(resp.error);
        return;
    }

    return resp.userData;
}

const userServices = {
    handleGetUserWithFriendsAndPosts,
    handleUserDataWithPosts,
    handleUpdateUserData,
    handlePasswordChange,
    handleGetUserFields,
    handleGetUserData,
    handleEmailChange,
    handleAddFriend,
    handleUnfriend,
    handleRegister,
    handleGetAll,
    handleLogout,
    handleLogin,
}

export default userServices;