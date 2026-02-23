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
    it("gets all user posts", () => {
        const { result } = renderHook(() => useUserServices(),);

        const testParams = {
            userId: "123",
            get fullUrl() {
                return `${url}/${this.userId}/posts`;
            },
        };

        act(() => {
            result.current.getUserPosts(testParams.userId);
        });

        expect(useFetchApiCallMock.fetchExecute).toHaveBeenCalledWith(testParams.fullUrl);
    });

    it("gets user data", () => {
        const { result } = renderHook(() => useUserServices());

        const testParams = {
            userId: "123",
            get fullUrl() {
                return `${url}/${this.userId}`;
            },
        };

        act(() => {
            result.current.getUserData(testParams.userId);
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