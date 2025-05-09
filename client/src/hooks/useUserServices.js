import { useCallback, useContext, useMemo } from "react";

import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../firebase/firebase-storage/config.js";

import useFetchApiCall from "./useFetchApiCall.js"

import { UserContext } from "../contexts/user-context.js";

export default function useUserServices() {
    const { fetchExecute, isLoading, abortFetchRequest } = useFetchApiCall();

    const { setIsUser } = useContext(UserContext);

    const userRequests = useMemo(() => [], []);

    const userUpdatePayload = useMemo(() => {
        return {
            validationData: {},
            newValues: {},
        }
    }, [])

    const abortAll = useCallback(() => {
        for (const { method, url } of userRequests) {
            abortFetchRequest(url, method);
        }
    }, [abortFetchRequest, userRequests])

    const getUserPosts = useCallback(async (userId) => {
        const url = `/users/${userId}/posts`;
        userRequests.push({ url, method: 'GET' });

        return await fetchExecute(url);
    }, [fetchExecute, userRequests]);

    const getUserData = useCallback(async (userId) => {
        const url = `/users/${userId}`;
        userRequests.push({ url, method: 'GET' });

        return await fetchExecute(url);
    }, [fetchExecute, userRequests]);

    const register = useCallback(async (payload) => {
        const defaultAvatarRef = ref(storage, '/images/default/default-profile-avatar.png');
        const defaultAvatarUrl = await getDownloadURL(defaultAvatarRef);
        payload.imageUrl = defaultAvatarUrl;

        const url = '/register';
        const method = 'POST';
        userRequests.push({ url, method, });

        const userId = await fetchExecute(url, method, payload);

        setIsUser(userId);

        return userId;
    }, [fetchExecute, setIsUser, userRequests]);

    const login = useCallback(async (payload) => {
        const url = '/login';
        const method = 'POST';
        userRequests.push({ url, method, });

        const userId = await fetchExecute(url, method, payload);

        setIsUser(userId);

        return userId;
    }, [fetchExecute, setIsUser, userRequests]);

    const logout = useCallback(async () => {
        const url = '/logout';
        const method = 'GET';
        userRequests.push({ url, method, });

        setIsUser(false);

    }, [setIsUser, userRequests]);

    const getAllUsers = useCallback(async () => {
        const url = '/users';
        const method = 'GET';
        userRequests.push({ url, method, });

        const users = await fetchExecute(url);

        return users?.reverse();
    }, [fetchExecute, userRequests]);

    const updateUser = useCallback(async (userId, payload) => {
        if (!payload.firstName) {
            throw new Error("First name field must not be empty!");
        } else if (!payload.lastName) {
            throw new Error("Last name field must not be empty!");
        } else if (!payload.birthday) {
            throw new Error("Birthday field must not be empty!");
        }

        const url = `/users/${userId}`;
        const method = 'PUT';
        userRequests.push({ url, method, });

        return await fetchExecute(url, method, payload);
    }, [fetchExecute, userRequests]);

    const getUserFields = useCallback(async (userId, fields) => {
        const url = `/users/${userId}/fields?${fields}`;
        const method = 'GET';
        userRequests.push({ url, method, });

        return await fetchExecute(url);
    }, [fetchExecute, userRequests]);

    const changeUserEmail = useCallback(async (userId, userData) => {
        const { newEmail, ...rest } = userData;
        userUpdatePayload.validationData = {
            ...rest
        };
        userUpdatePayload.newValues = {
            email: newEmail
        };

        const curEmail = userUpdatePayload.validationData.curEmail;
        if (!curEmail) {
            throw new Error('Current email field must be entered!');
        }
        if (!newEmail) {
            throw new Error('New email field must be entered!');
        }

        const curPass = userUpdatePayload.validationData.curPass;
        const rePass = userUpdatePayload.validationData.rePass;
        if (!curPass || !rePass) {
            throw new Error('Password fields are missing values!');
        }

        const isOldPasswordRepeatValid = (curPass === rePass);
        if (!isOldPasswordRepeatValid) {
            throw new Error('Repeat password does not match!');
        }

        const url = `/users/${userId}/credentials`;
        const method = 'PATCH';
        userRequests.push({ url, method, });

        return await fetchExecute(url, method, userUpdatePayload);
    }, [fetchExecute, userUpdatePayload, userRequests]);

    const changeUserPassword = useCallback(async (userId, userData) => {
        const { newPass, ...rest } = userData;
        userUpdatePayload.validationData = {
            ...rest
        };
        userUpdatePayload.newValues = {
            newPass
        };

        const curEmail = userUpdatePayload.validationData.curEmail;
        if (!curEmail) {
            throw new Error('Current email field must be entered!');
        }

        const curPass = userUpdatePayload.validationData.curPass;
        const rePass = userUpdatePayload.validationData.rePass;
        if (!curPass || !newPass || !rePass) {
            throw new Error('Password fields are missing values!');
        }

        const isNewPasswordRepeatValid = (newPass === rePass);
        if (!isNewPasswordRepeatValid) {
            throw new Error('Repeat password does not match!');
        }

        const url = `/users/${userId}/credentials`;
        const method = 'PATCH';
        userRequests.push({ url, method, });

        return await fetchExecute(`/users/${userId}/credentials`, method, userUpdatePayload);
    }, [fetchExecute, userUpdatePayload, userRequests]);

    const getFullUserProfile = useCallback(async (userId) => {
        const url = `/users/${userId}/full-profile`;
        const method = 'GET';
        userRequests.push({ url, method, });

        return await fetchExecute(url);
    }, [fetchExecute, userRequests]);

    const addFriend = useCallback(async (userId, newFriendId) => {
        const url = `/users/${userId}/friends/${newFriendId}`;
        const method = 'PATCH';
        userRequests.push({ url, method, });

        return await fetchExecute(url, method);
    }, [fetchExecute, userRequests]);

    const removeFriend = useCallback(async (userId, friendId) => {
        const url = `/users/${userId}/friends/${friendId}`;
        const method = 'DELETE';
        userRequests.push({ url, method, });

        return await fetchExecute(`/users/${userId}/friends/${friendId}`, 'DELETE');
    }, [fetchExecute, userRequests]);

    return {
        isLoading,
        register,
        login,
        logout,
        getUserPosts,
        getAllUsers,
        updateUser,
        getUserFields,
        changeUserEmail,
        changeUserPassword,
        getUserData,
        getFullUserProfile,
        addFriend,
        removeFriend,
        abortAll,
    }
}