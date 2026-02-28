import { renderHook } from "@testing-library/react";
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

        const testParams = {
            method: "POST",
            fullUrl: url,
            get text() {
                return text.trim();
            }
        };

        await result.current.createPost({ text });

        const trimmedText = text.trim();
        if (trimmedText) {
            expect(useFetchApiCallMock.fetchExecute).toHaveBeenCalledWith(testParams.fullUrl, testParams.method, { text: testParams.text });
        } else {
            expect(useFetchApiCallMock.fetchExecute).not.toHaveBeenCalled();
        };
    });

    it("deletes a post", async () => {
        const { result } = renderHook(() => usePostServices());

        const testParams = {
            postId: "123",
            method: "DELETE",
            get fullUrl() {
                return `${url}/${this.postId}`;
            },
        };

        await result.current.deletePost(testParams.postId);

        expect(useFetchApiCallMock.fetchExecute).toHaveBeenCalledWith(testParams.fullUrl, testParams.method);
    });

    it("likes a post", async () => {
        const { result } = renderHook(() => usePostServices());

        const testParams = {
            postId: "123",
            userId: "userId",
            method: "POST",
            get fullUrl() {
                return `${url}/${this.postId}/like/${this.userId}`;
            },
        };

        await result.current.likePost(testParams.userId, testParams.postId);

        expect(useFetchApiCallMock.fetchExecute).toHaveBeenCalledWith(testParams.fullUrl, testParams.method);
    });

    it("unlikes a post", async () => {
        const { result } = renderHook(() => usePostServices());

        const testParams = {
            postId: "123",
            userId: "userId",
            method: "DELETE",
            get fullUrl() {
                return `${url}/${this.postId}/like/${this.userId}`;
            },
        };

        await result.current.unlikePost(testParams.userId, testParams.postId);

        expect(useFetchApiCallMock.fetchExecute).toHaveBeenCalledWith(testParams.fullUrl, testParams.method);
    });

    it.each([
        { name: "edits a post with 'Random post content' as text content", text: "Random post content" },
        { name: "does not edit a post with empty text content", text: "" },
        { name: "does not edit a post with only spaces as text content", text: " " },
    ])("$name", async ({ text }) => {
        const { result } = renderHook(() => usePostServices());

        const testParams = {
            postId: "123",
            method: "PATCH",
            get fullUrl() {
                return `${url}/${this.postId}`;
            },
            get trimmedText() {
                return text.trim();
            },
        };

        await result.current.editPost(testParams.postId, text);

        if (testParams.trimmedText) {
            expect(useFetchApiCallMock.fetchExecute).toHaveBeenCalledWith(testParams.fullUrl, testParams.method, { text: testParams.trimmedText });
        } else {
            expect(useFetchApiCallMock.fetchExecute).not.toHaveBeenCalled();
        };
    });

    it("gets all posts", async () => {
        const { result } = renderHook(() => usePostServices());

        const testParams = {
            fullUrl: url,
        };

        await result.current.getAllPosts();

        expect(useFetchApiCallMock.fetchExecute).toHaveBeenCalledWith(testParams.fullUrl);
    });

    it("gets post with comments", async () => {
        const { result } = renderHook(() => usePostServices());

        const testParams = {
            postId: "123",
            get fullUrl() {
                return `${url}/${this.postId}/with-comments`;
            },
        };

        await result.current.getPostWithComments(testParams.postId);

        expect(useFetchApiCallMock.fetchExecute).toHaveBeenCalledWith(testParams.fullUrl);
    });

    it("aborts all ongoing calls", async () => {
        const { result } = renderHook(() => usePostServices());

        const testParams = {
            postId: "123",
            text: "Random comment content"
        };

        result.current.deletePost(testParams.postId);
        result.current.editPost(testParams.postId, testParams.text);
        result.current.createPost({ text: testParams.text });
        result.current.abortAll();

        expect(useFetchApiCallMock.abortFetchRequest).toHaveBeenNthCalledWith(
            1,
            `${url}/${testParams.postId}`,
            "DELETE"
        );

        expect(useFetchApiCallMock.abortFetchRequest).toHaveBeenNthCalledWith(
            2,
            `${url}/${testParams.postId}`,
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