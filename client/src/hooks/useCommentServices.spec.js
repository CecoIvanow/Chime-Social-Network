import { act, renderHook } from "@testing-library/react";
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
        const fullUrl = url;
        const method = "POST";

        await act(async () => {
            await result.current.createComment({ text });
        });

        const trimmedText = text.trim();
        if (trimmedText) {
            expect(useFetchApiCallMock.fetchExecute).toHaveBeenCalledWith(fullUrl, method, { text: trimmedText, });
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

        const commentId = "123";
        const fullUrl = url + `/${commentId}`;
        const method = "PATCH";

        await act(async () => {
            await result.current.updateComment(commentId, text);
        });

        const trimmedText = text.trim();
        if (trimmedText) {
            expect(useFetchApiCallMock.fetchExecute).toHaveBeenCalledWith(fullUrl, method, { text: trimmedText, });
        } else {
            expect(useFetchApiCallMock.fetchExecute).not.toHaveBeenCalled();
        };
    });

    it("deletes a comment", async () => {
        const { result } = renderHook(() => useCommentServices());

        const commentId = "123";
        const fullUrl = url + `/${commentId}`;
        const method = "DELETE";

        await act(async () => {
            await result.current.deleteComment(commentId);
        });

        expect(useFetchApiCallMock.fetchExecute).toHaveBeenCalledWith(fullUrl, method);
    });

    it("aborts all ongoing calls", async () => {
        const { result } = renderHook(() => useCommentServices());

        const commentId = "123";
        const text = "Random comment content";

        await act(async () => {
            await result.current.deleteComment(commentId);
            result.current.updateComment(commentId, text);
            result.current.createComment({ text });
            result.current.abortAll();
        });

        expect(useFetchApiCallMock.abortFetchRequest).toHaveBeenNthCalledWith(
            1,
            `${url}/${commentId}`,
            "DELETE"
        );

        expect(useFetchApiCallMock.abortFetchRequest).toHaveBeenNthCalledWith(
            2,
            `${url}/${commentId}`,
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