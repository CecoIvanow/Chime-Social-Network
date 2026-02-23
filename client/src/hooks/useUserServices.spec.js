import { getDownloadURL, ref } from "firebase/storage";

import { act, renderHook } from "@testing-library/react";
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

const setIsUser = vi.fn();

const useFetchApiCallMock = {
    fetchExecute: vi.fn(),
    isLoading: false,
    abortFetchRequest: vi.fn(),
};

const userContextWrapper = ({ children }) => React.createElement(UserContext.Provider, { value: { setIsUser } }, children);

describe("useUserServices tests", () => {
    it("gets all user posts", async () => {
        const { result } = renderHook(() => useUserServices(),);

        const testParams = {
            userId: "123",
            get fullUrl() {
                return `${url}/${this.userId}/posts`;
            },
        };

        await act(async () => {
            await result.current.getUserPosts(testParams.userId);
        });

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

        await act(async () => {
            await result.current.getUserData(testParams.userId);
        });

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

        await act(async () => {
            await result.current.register(testParams.payload);
        });

        expect(setIsUser).toHaveBeenCalledWith(testParams.userId);
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

        await act(async () => {
            await result.current.login(testParams.payload);
        });

        expect(setIsUser).toHaveBeenCalledWith(testParams.userId);
        expect(useFetchApiCallMock.fetchExecute).toHaveBeenCalledWith(testParams.fullUrl, testParams.method, testParams.payload);
    });

    it("logs out the user", async () => {
        const { result } = renderHook(() => useUserServices(), { wrapper: userContextWrapper });

        await act(async () => {
            await result.current.logout();
        });

        expect(setIsUser).toHaveBeenCalledWith(false);
    });

    it("gets all users and reverses the result", async () => {
        const { result } = renderHook(() => useUserServices());
        
        let response;
        const testParams = {
            fullUrl: url,
            responseParams: ["userOne", "userTwo", "userThree"],
        };

        useFetchApiCallMock.fetchExecute.mockResolvedValue([...testParams.responseParams]);

        await act(async () => {
            response = await result.current.getAllUsers();
        });

        expect(useFetchApiCallMock.fetchExecute).toHaveBeenCalledWith(testParams.fullUrl);
        for (let i = 0; i < testParams.responseParams.length; i++) {
            expect(response[i]).toBe(testParams.responseParams[testParams.responseParams.length - 1 - i]);
        };
    });

    it("updates the user's information", async () => {
        const { result } = renderHook(() => useUserServices(), { wrapper: userContextWrapper });

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

        await act(async () => {
            await result.current.updateUser(testParams.userId, testParams.payload);
        });

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
        const { result } = renderHook(() => useUserServices(), { wrapper: userContextWrapper });

        const testParams = {
            userId: "123",
            method: "PUT",
            get fullUrl() {
                return `/users/${this.userId}`;
            },
            payload,
        };

        await act(async () => {
            try {
                await result.current.updateUser(testParams.userId, testParams.payload);
            } catch (error) {
                expect(error.message).toEqual(errorMessage);
            };
        });

        expect(useFetchApiCallMock.fetchExecute).not.toHaveBeenCalled();
    });

    it("gets all user fields", async () => {
        const { result } = renderHook(() => useUserServices(),);

        const testParams = {
            userId: "123",
            fields: "firstName",
            get fullUrl() {
                return `${url}/${this.userId}/fields?${this.fields}`;
            },
        };

        await act(async () => {
            await result.current.getUserFields(testParams.userId, testParams.fields);
        });

        expect(useFetchApiCallMock.fetchExecute).toHaveBeenCalledWith(testParams.fullUrl);
    });

    it.skip("aborts all ongoing calls", () => {
        const { result } = renderHook(() => useUserServices());

        const postId = "123";
        const text = "Random comment content";

        act(() => {
            result.current.deletePost(postId);
            result.current.editPost(postId, text);
            result.current.createPost({ text });
            result.current.abortAll();
        });

        expect(useFetchApiCallMock.abortFetchRequest).toHaveBeenNthCalledWith(
            1,
            `${url}/${postId}`,
            "DELETE"
        );

        expect(useFetchApiCallMock.abortFetchRequest).toHaveBeenNthCalledWith(
            2,
            `${url}/${postId}`,
            "PATCH"
        );

        expect(useFetchApiCallMock.abortFetchRequest).toHaveBeenNthCalledWith(
            3,
            url,
            "POST"
        );

        expect(useFetchApiCallMock.abortFetchRequest).toHaveBeenCalledTimes(3);
    });
});