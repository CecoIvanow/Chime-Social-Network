import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import usePostServices from "./usePostServices";

vi.mock("./useFetchApiCall.js", () => ({
    default: () => ({
        ...useFetchApiCallMock
    })
}));

const url = "/posts";

const useFetchApiCallMock = {
    fetchExecute: vi.fn(),
    isLoading: false,
    abortFetchRequest: vi.fn(),
};

describe("usePostServices tests", () => {
    it.each([
        { name: "creates a post with 'Random post content' as text content", text: "Random post content" },
        { name: "does not create a post with empty text content", text: "" },
        { name: "does not create a post with only spaces as text content", text: " " },
    ])("$name", async ({ text }) => {
        const { result } = renderHook(() => usePostServices());
        const fullUrl = url;
        const method = "POST";

        await act(async () => {
            await result.current.createPost({ text });
        });

        const trimmedText = text.trim();
        if (trimmedText) {
            expect(useFetchApiCallMock.fetchExecute).toHaveBeenCalledWith(fullUrl, method, { text: trimmedText, });
        } else {
            expect(useFetchApiCallMock.fetchExecute).not.toHaveBeenCalled();
        };
    });

    it("deletes a post", async () => {
        const { result } = renderHook(() => usePostServices());

        const postId = "123";

        const fullUrl = url + `/${postId}`;
        const method = "DELETE";

        await act(async () => {
            await result.current.deletePost(postId);
        });

        expect(useFetchApiCallMock.fetchExecute).toHaveBeenCalledWith(fullUrl, method);
    });

    it("likes a post", async () => {
        const { result } = renderHook(() => usePostServices());

        const userId = "userId"
        const postId = "123";

        const fullUrl = url + `/${postId}/like/${userId}`;
        const method = "POST";

        await act(async () => {
            await result.current.likePost(userId, postId);
        });

        expect(useFetchApiCallMock.fetchExecute).toHaveBeenCalledWith(fullUrl, method);
    });

    it("unlikes a post", async () => {
        const { result } = renderHook(() => usePostServices());

        const userId = "userId"
        const postId = "123";

        const fullUrl = url + `/${postId}/like/${userId}`;
        const method = "DELETE";

        await act(async () => {
            await result.current.unlikePost(userId, postId);
        });

        expect(useFetchApiCallMock.fetchExecute).toHaveBeenCalledWith(fullUrl, method);
    });

    it.each([
        { name: "edits a post with 'Random post content' as text content", text: "Random post content" },
        { name: "does not edit a post with empty text content", text: "" },
        { name: "does not edit a post with only spaces as text content", text: " " },
    ])("$name", async ({ text }) => {
        const { result } = renderHook(() => usePostServices());

        const postId = "123";

        const fullUrl = url + `/${postId}`;
        const method = "PATCH";

        await act(async () => {
            await result.current.editPost(postId, text);
        });

        const trimmedText = text.trim();
        if (trimmedText) {
            expect(useFetchApiCallMock.fetchExecute).toHaveBeenCalledWith(fullUrl, method, { text: trimmedText, });
        } else {
            expect(useFetchApiCallMock.fetchExecute).not.toHaveBeenCalled();
        };
    });

    it("gets all posts", async () => {
        const { result } = renderHook(() => usePostServices());

        const fullUrl = url;

        await act(async () => {
            await result.current.getAllPosts();
        });

        expect(useFetchApiCallMock.fetchExecute).toHaveBeenCalledWith(fullUrl);
    });

    it("gets post with comments", async () => {
        const { result } = renderHook(() => usePostServices());

        const postId = "123";
        const fullUrl = `${url}/${postId}/with-comments`;

        await act(async () => {
            await result.current.getPostWithComments(postId);
        });

        expect(useFetchApiCallMock.fetchExecute).toHaveBeenCalledWith(fullUrl);
    });

    it("aborts all ongoing calls", async () => {
        const { result } = renderHook(() => usePostServices());

        const postId = "123";
        const text = "Random comment content";

        await act(async () => {
            await result.current.deletePost(postId);
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