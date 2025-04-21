import { useCallback, useContext, useMemo } from "react";

import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../firebase/firebase-storage/config.js";

import useFetch from "./useFetch.js"

import { UserContext } from "../contexts/user-context.js";

export default function useUserServices() {
    const { fetchExecute, isLoading, isLoadingRef } = useFetch();
    const { setIsUser } = useContext(UserContext);

    const userUpdatePayload = useMemo(() => {
        return {
            validationData: {},
            newValues: {},
        }
    }, [])

    const register = useCallback(async (payload) => {
        const defaultAvatarRef = ref(storage, '/images/default/default-profile-avatar.png');
        const defaultAvatarUrl = await getDownloadURL(defaultAvatarRef);

        payload.imageUrl = defaultAvatarUrl;

        if (isLoadingRef.current) {
            return;
        }

        const userId = await fetchExecute('/register', 'POST', payload);

        setIsUser(userId);

    }, [fetchExecute, isLoadingRef, setIsUser]);

    const login = useCallback(async (payload) => {

        if (isLoadingRef.current) {
            return;
        }

        const userId = await fetchExecute('/login', 'POST', payload);

        setIsUser(userId);

        return userId;

    }, [fetchExecute, isLoadingRef, setIsUser]);

    const logout = useCallback(async () => {

        if (isLoadingRef.current) {
            return;
        }

        setIsUser(false);

    }, [isLoadingRef, setIsUser]);

    const getUserWithPosts = useCallback(async (userId) => {
        if (isLoadingRef.current) {
            return;
        }

        const userData = await fetchExecute(`/users/${userId}/with-posts`);

        return userData
    }, [fetchExecute, isLoadingRef]);

    const getAllUsers = useCallback(async () => {
        if (isLoadingRef.current) {
            return;
        }

        const users = await fetchExecute(`/users`);

        users?.reverse();

        return users
    }, [fetchExecute, isLoadingRef]);

    const updateUser = useCallback(async (userId, payload) => {
        if (isLoadingRef.current) {
            return;
        }

        if (!payload.firstName) {
            throw new Error("First name field must not be empty!");
        } else if (!payload.lastName) {
            throw new Error("Last name field must not be empty!");
        } else if (!payload.birthday) {
            throw new Error("Birthday field must not be empty!");
        }

        const data = await fetchExecute(`/users/${userId}`, 'PUT', payload);

        return data;

    }, [fetchExecute, isLoadingRef]);

    const getUserFields = useCallback(async (userId, fields) => {
        if (isLoadingRef.current) {
            return;
        }

        const data = await fetchExecute(`/users/${userId}/fields?${fields}`);

        return data;

    }, [fetchExecute, isLoadingRef]);

    const changeUserEmail = useCallback(async (userId, userData) => {
        if (isLoadingRef.current) {
            return;
        }

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

    }, [fetchExecute, isLoadingRef, userUpdatePayload]);

    const changeUserPassword = useCallback(async (userId, userData) => {
        if (isLoadingRef.current) {
            return;
        }

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

    }, [fetchExecute, isLoadingRef, userUpdatePayload]);

    const getUserData = useCallback(async (userId) => {
        if (isLoadingRef.current) {
            return;
        }

        const userData = await fetchExecute(`/users/${userId}`);

        return userData;

    }, [fetchExecute, isLoadingRef]);

    const getFullUserProfile = useCallback(async (userId) => {
        if (isLoadingRef.current) {
            return;
        }

        const userData = await fetchExecute(`/users/${userId}/full-profile`);

        return userData;

    }, [fetchExecute, isLoadingRef]);

    const addFriend = useCallback(async (userId, newFriendId) => {
        if (isLoadingRef.current) {
            return;
        }

        const friendId = await fetchExecute(`/users/${userId}/friends/${newFriendId}`, 'PATCH');

        return friendId;

    }, [fetchExecute, isLoadingRef]);

    const removeFriend = useCallback(async (userId, friendId) => {
        if (isLoadingRef.current) {
            return;
        }

        const removedFriendId = await fetchExecute(`/users/${userId}/friends/${friendId}`, 'DELETE');

        return removedFriendId;

    }, [fetchExecute, isLoadingRef]);

    return {
        isLoading,
        register,
        login,
        logout,
        getUserWithPosts,
        getAllUsers,
        updateUser,
        getUserFields,
        changeUserEmail,
        changeUserPassword,
        getUserData,
        getFullUserProfile,
        addFriend,
        removeFriend,
    }
}