import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import useUserServices from "./useUserServices";

vi.mock("./useFetchApiCall.js", () => ({
    default: () => ({
        ...useFetchApiCallMock
    })
}));

const url = "/users";

const useFetchApiCallMock = {
    fetchExecute: vi.fn(),
    isLoading: false,
    abortFetchRequest: vi.fn(),
};

describe("useUserServices tests", () => {
    it("gets all user posts", () => {
        const { result } = renderHook(() => useUserServices());

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