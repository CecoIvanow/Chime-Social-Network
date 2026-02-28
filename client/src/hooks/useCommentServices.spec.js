import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import useCommentServices from "./useCommentServices";

vi.mock("./useFetchApiCall.js", () => ({
    default: () => ({
        ...useFetchApiCallMock
    })
}));

const url = "/comments";

const useFetchApiCallMock = {
    fetchExecute: vi.fn(),
    isLoading: false,
    abortFetchRequest: vi.fn(),
};

describe("useCommentServices tests", () => {
    it.each([
        { name: "creates a comment with 'Random comment content' as text content", text: "Random comment content" },
        { name: "does not create a comment with empty text content", text: "" },
        { name: "does not create a comment with only spaces as text content", text: " " },
    ])("$name", async ({ text }) => {
        const { result } = renderHook(() => useCommentServices());

        const testParams = {
            method: "POST",
            fullUrl: url,
            get trimmedText() {
                return text.trim();
            },
        };

        await result.current.createComment({ text });

        if (testParams.trimmedText) {
            expect(useFetchApiCallMock.fetchExecute).toHaveBeenCalledWith(testParams.fullUrl, testParams.method, { text: testParams.trimmedText, });
        } else {
            expect(useFetchApiCallMock.fetchExecute).not.toHaveBeenCalled();
        };
    });

    it.each([
        { name: "updates a comment with 'Random comment content' as text content", text: "Random comment content" },
        { name: "does not update a comment with empty text content", text: "" },
        { name: "does not update a comment with only spaces as text content", text: " " },
    ])("$name", async ({ text }) => {
        const { result } = renderHook(() => useCommentServices());

        const testParams = {
            commentId: "123",
            method: "PATCH",
            get fullUrl() {
                return `${url}/${this.commentId}`
            },
            get trimmedText() {
                return text.trim();
            },
        };

        await result.current.updateComment(testParams.commentId, text);

        if (testParams.trimmedText) {
            expect(useFetchApiCallMock.fetchExecute).toHaveBeenCalledWith(testParams.fullUrl, testParams.method, { text: testParams.trimmedText, });
        } else {
            expect(useFetchApiCallMock.fetchExecute).not.toHaveBeenCalled();
        };
    });

    it("deletes a comment", async () => {
        const { result } = renderHook(() => useCommentServices());

        const testParams = {
            commentId: "123",
            method: "DELETE",
            get fullUrl() {
                return `${url}/${this.commentId}`
            },
        };

        await result.current.deleteComment(testParams.commentId);

        expect(useFetchApiCallMock.fetchExecute).toHaveBeenCalledWith(testParams.fullUrl, testParams.method);
    });

    it("aborts all ongoing calls", async () => {
        const { result } = renderHook(() => useCommentServices());

        const testParams = {
            commentId: "123",
            text: "Random comment content",
        };

        result.current.deleteComment(testParams.commentId);
        result.current.updateComment(testParams.commentId, testParams.text);
        result.current.createComment({ text: testParams.text });
        result.current.abortAll();

        expect(useFetchApiCallMock.abortFetchRequest).toHaveBeenNthCalledWith(
            1,
            `${url}/${testParams.commentId}`,
            "DELETE"
        );

        expect(useFetchApiCallMock.abortFetchRequest).toHaveBeenNthCalledWith(
            2,
            `${url}/${testParams.commentId}`,
            "PATCH"
        );

        expect(useFetchApiCallMock.abortFetchRequest).toHaveBeenNthCalledWith(
            3,
            `${url}`,
            "POST"
        );

        expect(useFetchApiCallMock.abortFetchRequest).toHaveBeenCalledTimes(3);
    });
});