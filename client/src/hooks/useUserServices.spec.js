import { getDownloadURL, ref } from "firebase/storage";

import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { UserContext } from "../contexts/user-context";

import useUserServices from "./useUserServices";
import React from "react";

vi.mock("./useFetchApiCall.js", () => ({
    default: () => ({
        ...useFetchApiCallMock
    })
}));

vi.mock("firebase/storage", () => ({
    ref: vi.fn(),
    getDownloadURL: vi.fn(),
}));

vi.mock("../firebase/firebase-storage/config", () => ({
    storage: {},
}));

const url = "/users";

const setLoggedInUserId = vi.fn();

const useFetchApiCallMock = {
    fetchExecute: vi.fn(),
    isLoading: false,
    abortFetchRequest: vi.fn(),
};

const userContextWrapper = ({ children }) => React.createElement(UserContext.Provider, { value: { setLoggedInUserId } }, children);

describe("useUserServices tests", () => {
    it("gets all user posts", async () => {
        const { result } = renderHook(() => useUserServices(),);

        const testParams = {
            userId: "123",
            get fullUrl() {
                return `${url}/${this.userId}/posts`;
            },
        };

        await result.current.getUserPosts(testParams.userId);

        expect(useFetchApiCallMock.fetchExecute).toHaveBeenCalledWith(testParams.fullUrl);
    });

    it("gets user data", async () => {
        const { result } = renderHook(() => useUserServices());

        const testParams = {
            userId: "123",
            get fullUrl() {
                return `${url}/${this.userId}`;
            },
        };

        await result.current.getUserData(testParams.userId);

        expect(useFetchApiCallMock.fetchExecute).toHaveBeenCalledWith(testParams.fullUrl);
    });

    it("registers the user and sets the user id", async () => {
        const { result } = renderHook(() => useUserServices(), { wrapper: userContextWrapper });

        const testParams = {
            userId: "123",
            method: "POST",
            fullUrl: "/register",
            payload: {
                imageUrl: "/image-uri.jpeg",
            },
        };

        ref.mockReturnValue("mock-image-ref");
        getDownloadURL.mockResolvedValue(testParams.payload.imageUrl);
        useFetchApiCallMock.fetchExecute.mockResolvedValue(testParams.userId);

        await result.current.register(testParams.payload);

        expect(setLoggedInUserId).toHaveBeenCalledWith(testParams.userId);
        expect(useFetchApiCallMock.fetchExecute).toHaveBeenCalledWith(testParams.fullUrl, testParams.method, testParams.payload);
    });

    it("logs in the user and sets the user id", async () => {
        const { result } = renderHook(() => useUserServices(), { wrapper: userContextWrapper });

        const testParams = {
            userId: "123",
            method: "POST",
            fullUrl: "/login",
            payload: {},
        };

        useFetchApiCallMock.fetchExecute.mockResolvedValue(testParams.userId);

        await result.current.login(testParams.payload);

        expect(setLoggedInUserId).toHaveBeenCalledWith(testParams.userId);
        expect(useFetchApiCallMock.fetchExecute).toHaveBeenCalledWith(testParams.fullUrl, testParams.method, testParams.payload);
    });

    it("logs out the user", async () => {
        const { result } = renderHook(() => useUserServices(), { wrapper: userContextWrapper });

        await result.current.logout();

        expect(setLoggedInUserId).toHaveBeenCalledWith(false);
    });

    it("gets all users and reverses the result", async () => {
        const { result } = renderHook(() => useUserServices());

        const testParams = {
            fullUrl: url,
            responseParams: ["userOne", "userTwo", "userThree"],
        };

        useFetchApiCallMock.fetchExecute.mockResolvedValue([...testParams.responseParams]);

        const response = await result.current.getAllUsers();

        expect(useFetchApiCallMock.fetchExecute).toHaveBeenCalledWith(testParams.fullUrl);
        for (let i = 0; i < testParams.responseParams.length; i++) {
            expect(response[i]).toBe(testParams.responseParams[testParams.responseParams.length - 1 - i]);
        };
    });

    it("updates the user's information", async () => {
        const { result } = renderHook(() => useUserServices());

        const testParams = {
            userId: "123",
            method: "PUT",
            get fullUrl() {
                return `/users/${this.userId}`;
            },
            payload: {
                firstName: "John",
                lastName: "Doe",
                birthday: "01.01.1991",
            },
        };

        await result.current.updateUser(testParams.userId, testParams.payload);

        expect(useFetchApiCallMock.fetchExecute).toHaveBeenCalledWith(testParams.fullUrl, testParams.method, testParams.payload);
    });

    it.each([
        {
            name: "on user information update throws an error when first name is not entered",
            payload: {
                firstName: "",
                lastName: "Doe",
                birthday: "01.01.1991",
            },
            errorMessage: "First name field must not be empty!",
        },
        {
            name: "on user information update throws an error when last name is not entered",
            payload: {
                firstName: "John",
                lastName: "",
                birthday: "01.01.1991",
            },
            errorMessage: "Last name field must not be empty!",
        },
        {
            name: "on user information update throws an error when birthday is not entered",
            payload: {
                firstName: "John",
                lastName: "Doe",
                birthday: "",
            },
            errorMessage: "Birthday field must not be empty!",
        },
    ])("$name", async ({ payload, errorMessage }) => {
        const { result } = renderHook(() => useUserServices());

        const testParams = {
            userId: "123",
            method: "PUT",
            get fullUrl() {
                return `/users/${this.userId}`;
            },
            payload,
        };

        try {
            await result.current.updateUser(testParams.userId, testParams.payload);
        } catch (error) {
            expect(error.message).toEqual(errorMessage);
        };
        expect(useFetchApiCallMock.fetchExecute).not.toHaveBeenCalled();
    });

    it("gets all user fields", async () => {
        const { result } = renderHook(() => useUserServices());

        const testParams = {
            userId: "123",
            fields: "firstName",
            get fullUrl() {
                return `${url}/${this.userId}/fields?${this.fields}`;
            },
        };

        await result.current.getUserFields(testParams.userId, testParams.fields);

        expect(useFetchApiCallMock.fetchExecute).toHaveBeenCalledWith(testParams.fullUrl);
    });

    it("changes the user email", async () => {
        const { result } = renderHook(() => useUserServices());

        const testParams = {
            userId: "123",
            method: "PATCH",
            get fullUrl() {
                return `${url}/${this.userId}/credentials`;
            },
            userData: {
                rePass: "user-password",
                curPass: "user-password",
                newEmail: "john.doe2@email.com",
                curEmail: "john.doe@email.com",
            },
            userUpdatePayload: {
                validationData: {
                    rePass: "user-password",
                    curPass: "user-password",
                    curEmail: "john.doe@email.com",
                },
                newValues: {
                    email: "john.doe2@email.com",
                },
            },
        };

        await result.current.changeUserEmail(testParams.userId, testParams.userData);

        expect(useFetchApiCallMock.fetchExecute).toHaveBeenCalledWith(testParams.fullUrl, testParams.method, testParams.userUpdatePayload);
    });

    it.each([
        {
            name: "on user email change throws an error on not entered current email",
            userData: {
                rePass: "user-password",
                curPass: "user-password",
                newEmail: "john.doe2@email.com",
                curEmail: "",
            },
            errorMessage: "Current email field must be entered!",
        },
        {
            name: "on user email change throws an error on not entered new email",
            userData: {
                rePass: "user-password",
                curPass: "user-password",
                newEmail: "",
                curEmail: "john.doe@email.com",
            },
            errorMessage: "New email field must be entered!",
        },
        {
            name: "on user email change throws an error on not entered current password",
            userData: {
                rePass: "user-password",
                curPass: "",
                newEmail: "john.doe2@email.com",
                curEmail: "john.doe@email.com",
            },
            errorMessage: "Password fields are missing values!",
        },
        {
            name: "on user email change throws an error on not entered repeat password",
            userData: {
                rePass: "",
                curPass: "user-password",
                newEmail: "john.doe2@email.com",
                curEmail: "john.doe@email.com",
            },
            errorMessage: "Password fields are missing values!",
        },
        {
            name: "on user email change throws an error on different currect and repeat apsswords",
            userData: {
                rePass: "user-password",
                curPass: "other-user-password",
                newEmail: "john.doe2@email.com",
                curEmail: "john.doe@email.com",
            },
            errorMessage: "Repeat password does not match!",
        },
    ])("$name", async ({ userData, errorMessage }) => {
        const { result } = renderHook(() => useUserServices());

        const testParams = {
            userId: "123",
            method: "PATCH",
            get fullUrl() {
                return `${url}/${this.userId}/credentials`;
            },
            userData,
            userUpdatePayload: {
                validationData: {
                    rePass: "user-password",
                    curPass: "user-password",
                    curEmail: "john.doe@email.com",
                },
                newValues: {
                    email: "john.doe2@email.com",
                },
            },
        };

        try {
            await result.current.changeUserEmail(testParams.userId, testParams.userData);
        } catch (error) {
            expect(error.message).toBe(errorMessage);
        };

        expect(useFetchApiCallMock.fetchExecute).not.toHaveBeenCalled();
    });

    it("changes the user password", async () => {
        const { result } = renderHook(() => useUserServices());

        const testParams = {
            userId: "123",
            method: "PATCH",
            get fullUrl() {
                return `${url}/${this.userId}/credentials`;
            },
            userData: {
                newPass: "new-password",
                rePass: "new-password",
                curPass: "old-password",
                curEmail: "john.doe@email.com",
            },
            userUpdatePayload: {
                validationData: {
                    rePass: "new-password",
                    curPass: "old-password",
                    curEmail: "john.doe@email.com",
                },
                newValues: {
                    newPass: "new-password",
                },
            },
        };

        await result.current.changeUserPassword(testParams.userId, testParams.userData);

        expect(useFetchApiCallMock.fetchExecute).toHaveBeenCalledWith(testParams.fullUrl, testParams.method, testParams.userUpdatePayload);
    });

    it.each([
        {
            name: "on user password change throws an error on not entered new password",
            userData: {
                newPass: "",
                rePass: "new-password",
                curPass: "old-password",
                curEmail: "john.doe@email.com",
            },
            errorMessage: "Password fields are missing values!",
        },
        {
            name: "on user password change throws an error on not entered repeat password",
            userData: {
                newPass: "new-password",
                rePass: "",
                curPass: "old-password",
                curEmail: "john.doe@email.com",
            },
            errorMessage: "Password fields are missing values!",
        },
        {
            name: "on user password change throws an error on not entered current password",
            userData: {
                newPass: "new-password",
                rePass: "new-password",
                curPass: "",
                curEmail: "john.doe@email.com",
            },
            errorMessage: "Password fields are missing values!",
        },
        {
            name: "on user password change throws an error on not entered email",
            userData: {
                newPass: "new-password",
                rePass: "new-password",
                curPass: "old-password",
                curEmail: "",
            },
            errorMessage: "Current email field must be entered!",
        },
        {
            name: "on user password change throws an error on new and repeat passwords not matching",
            userData: {
                newPass: "new-password",
                rePass: "different-password",
                curPass: "old-password",
                curEmail: "john.doe@email.com",
            },
            errorMessage: "Repeat password does not match!",
        },
    ])("$name", async ({ userData, errorMessage }) => {
        const { result } = renderHook(() => useUserServices());

        const testParams = {
            userId: "123",
            method: "PATCH",
            get fullUrl() {
                return `${url}/${this.userId}/credentials`;
            },
            userData,
        };

        try {
            await result.current.changeUserPassword(testParams.userId, testParams.userData);
        } catch (error) {
            expect(error.message).toBe(errorMessage);
        };

        expect(useFetchApiCallMock.fetchExecute).not.toHaveBeenCalled();
    });

    it("gets user full profile information", async () => {
        const { result } = renderHook(() => useUserServices());

        const testParams = {
            userId: "123",
            get fullUrl() {
                return `${url}/${this.userId}/full-profile`;
            },
        };

        await result.current.getFullUserProfile(testParams.userId);

        expect(useFetchApiCallMock.fetchExecute).toHaveBeenCalledWith(testParams.fullUrl);
    });

    it("adds another user as friend", async () => {
        const { result } = renderHook(() => useUserServices());

        const testParams = {
            userId: "123",
            newFriendId: "4453",
            method: "PATCH",
            get fullUrl() {
                return `${url}/${this.userId}/friends/${this.newFriendId}`;
            },
        };

        await result.current.addFriend(testParams.userId, testParams.newFriendId);

        expect(useFetchApiCallMock.fetchExecute).toHaveBeenCalledWith(testParams.fullUrl, testParams.method);
    });

    it("removes another user from friends", async () => {
        const { result } = renderHook(() => useUserServices());

        const testParams = {
            userId: "123",
            friendId: "4453",
            method: "DELETE",
            get fullUrl() {
                return `${url}/${this.userId}/friends/${this.friendId}`;
            },
        };

        await result.current.removeFriend(testParams.userId, testParams.friendId);

        expect(useFetchApiCallMock.fetchExecute).toHaveBeenCalledWith(testParams.fullUrl, testParams.method);
    });

    it("aborts all ongoing calls", async () => {
        const { result } = renderHook(() => useUserServices());

        const userId = "123";

        result.current.getUserPosts(userId);
        result.current.getUserData(userId);
        result.current.abortAll();

        expect(useFetchApiCallMock.abortFetchRequest).toHaveBeenNthCalledWith(
            1,
            `${url}/${userId}/posts`,
            "GET",
        );

        expect(useFetchApiCallMock.abortFetchRequest).toHaveBeenNthCalledWith(
            2,
            `${url}/${userId}`,
            "GET",
        );

        expect(useFetchApiCallMock.abortFetchRequest).toHaveBeenCalledTimes(2);
    });
});