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

        const userId = "123";
        const fullUrl = url + `/${userId}/posts`;

        act(() => {
            result.current.getUserPosts(userId);
        });

        expect(useFetchApiCallMock.fetchExecute).toHaveBeenCalledWith(fullUrl);
    });

    it("gets user data", () => {
        const { result } = renderHook(() => useUserServices());

        const userId = "123";
        const fullUrl = url + `/${userId}`;

        act(() => {
            result.current.getUserData(userId);
        });

        expect(useFetchApiCallMock.fetchExecute).toHaveBeenCalledWith(fullUrl);
    });

    it("registers the user and sets the user id", async () => {
        const { result } = renderHook(() => useUserServices(), { wrapper: userContextWrapper });

        ref.mockReturnValue("mock-image-ref");
        getDownloadURL.mockResolvedValue("/image-uri.jpeg");
        useFetchApiCallMock.fetchExecute.mockResolvedValue("123");

        const payload = {};
        const fullUrl = "/register";
        const method = "POST";

        await act( async() => {
            await result.current.register(payload);
        });

        expect(setIsUser).toHaveBeenCalledWith("123");
        expect(useFetchApiCallMock.fetchExecute).toHaveBeenCalledWith(fullUrl, method, { imageUrl: "/image-uri.jpeg" });
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