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
        throw new Error(resp.error);
    }

    helpers.setIsUser(resp.userId);
}

async function handleLogin(data, helpers = {}) {
    const resp = await api.post('/login', data);

    if (resp.error) {
        throw new Error(resp.error);
    }

    helpers.setIsUser(resp.userId);
}

async function handleLogout(setIsUser) {
    setIsUser(false);
}

async function handleGetUserDataWithPosts(userId, helpers = {}) {
    const resp = await api.get(`/users/${userId}/with-posts`, { signal: helpers.abortSignal });

    if (resp.error) {
        throw new Error(resp.error);
    }

    return resp.userData;
}

async function handleGetAll(helpers = {}) {
    const resp = await api.get('/users', { signal: helpers.abortSignal });

    if (resp.error) {
        throw new Error(resp.error);
    }

    resp.users.reverse()

    return resp.users;
}

async function handleUpdateUserData(userId, payload, helpers = {}) {
    if (!payload.firstName) {
        throw new Error("First name field must not be empty!");
    } else if (!payload.lastName) {
        throw new Error("Last name field must not be empty!");
    } else if (!payload.birthday) {
        throw new Error("Birthday field must not be empty!");
    }

    const resp = await api.put(`/users/${userId}`, payload);

    if (resp?.error) {
        throw new Error(resp.error);
    }
}

async function handleGetUserFields(userId, fields, helpers = {}) {
    const resp = await api.get(`/users/${userId}/fields?${fields}`, { signal: helpers.abortSignal });

    if (resp.error) {
        throw new Error(resp.error);
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

    const curPass = userUpdatePayload.validationData.curPass;
    const rePass = userUpdatePayload.validationData.rePass;
    const curEmail = userUpdatePayload.validationData.curEmail;
    const isOldPasswordRepeatValid = (curPass === rePass);

    if (!curEmail) {
        throw new Error('Current email field must be entered!');
    }

    if (!newEmail) {
        throw new Error('New email field must be entered!');
    }

    if (!curPass || !rePass) {
        throw new Error('Password fields are missing values!');
    }

    if (!isOldPasswordRepeatValid) {
        throw new Error('Repeat password does not match!');
    }

    const resp = await api.patch(`/users/${userId}/credentials`, userUpdatePayload);

    if (resp?.error) {
        throw new Error(resp.error);
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

    const curPass = userUpdatePayload.validationData.curPass;
    const rePass = userUpdatePayload.validationData.rePass;
    const curEmail = userUpdatePayload.validationData.curEmail;
    const isNewPasswordRepeatValid = (newPass === rePass);

    if (!curEmail) {
        throw new Error('Current email field must be entered!');
    }

    if (!curPass || !newPass || !rePass) {
        throw new Error('Password fields are missing values!');
    }

    if (!isNewPasswordRepeatValid) {
        throw new Error('Repeat password does not match!');
    }

    const resp = await api.patch(`/users/${userId}/credentials`, userUpdatePayload);

    if (resp?.error) {
        throw new Error(resp.error);
    }
}

async function handleGetUserData(userId, helpers = {}) {
    const resp = await api.get(`/users/${userId}`, { signal: helpers.abortSignal });

    if (resp.error) {
        throw new Error(resp.error);
    }

    return resp.userData;
}

async function handleAddFriend(userId, newFriendId, helpers = {}) {
    const resp = await api.patch(`/users/${userId}/friends/${newFriendId}`);

    if (resp?.error) {
        throw new Error(resp.error);
    }
}

async function handleUnfriend(userId, friendId, helpers = {}) {
    const resp = await api.delete(`/users/${userId}/friends/${friendId}`);

    if (resp?.error) {
        throw new Error(resp.error);
    }
}

async function handleGetFullUserProfile(userId, helpers = {}) {
    const resp = await api.get(`/users/${userId}/full-profile`, { signal: helpers.abortSignal });

    if (resp.error) {
        throw new Error(resp.error);
    }

    return resp.userData;
}

const userServices = {
    handleGetUserDataWithPosts,
    handleGetFullUserProfile,
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