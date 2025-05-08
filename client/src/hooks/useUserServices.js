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

        const userId = await fetchExecute('/register', 'POST', payload);

        setIsUser(userId);

    }, [fetchExecute, setIsUser]);

    const login = useCallback(async (payload) => {

        const userId = await fetchExecute('/login', 'POST', payload);

        setIsUser(userId);

        return userId;

    }, [fetchExecute, setIsUser]);

    const logout = useCallback(async () => {

        setIsUser(false);

    }, [setIsUser]);

    const getAllUsers = useCallback(async () => {

        const users = await fetchExecute(`/users`);

        users?.reverse();

        return users
    }, [fetchExecute]);

    const updateUser = useCallback(async (userId, payload) => {

        if (!payload.firstName) {
            throw new Error("First name field must not be empty!");
        } else if (!payload.lastName) {
            throw new Error("Last name field must not be empty!");
        } else if (!payload.birthday) {
            throw new Error("Birthday field must not be empty!");
        }

        const data = await fetchExecute(`/users/${userId}`, 'PUT', payload);

        return data;

    }, [fetchExecute]);

    const getUserFields = useCallback(async (userId, fields) => {

        const data = await fetchExecute(`/users/${userId}/fields?${fields}`);

        return data;

    }, [fetchExecute]);

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

        const data = await fetchExecute(`/users/${userId}/credentials`, 'PATCH', userUpdatePayload);

        return data;

    }, [fetchExecute, userUpdatePayload]);

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

        const data = await fetchExecute(`/users/${userId}/credentials`, 'PATCH', userUpdatePayload);

        return data;

    }, [fetchExecute, userUpdatePayload]);

    const getFullUserProfile = useCallback(async (userId) => {

        const userData = await fetchExecute(`/users/${userId}/full-profile`);

        return userData;

    }, [fetchExecute]);

    const addFriend = useCallback(async (userId, newFriendId) => {

        const friendId = await fetchExecute(`/users/${userId}/friends/${newFriendId}`, 'PATCH');

        return friendId;

    }, [fetchExecute]);

    const removeFriend = useCallback(async (userId, friendId) => {

        const removedFriendId = await fetchExecute(`/users/${userId}/friends/${friendId}`, 'DELETE');

        return removedFriendId;

    }, [fetchExecute]);

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