import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import useCommentServices from "./useCommentServices";

vi.mock("./useFetchApiCall.js", () => ({
    default: () => ({
        ...useFetchApiCallMock
    })
}));

const useFetchApiCallMock = {
    fetchExecute: vi.fn(),
    isLoading: false,
    abortFetchRequest: vi.fn(),
};

describe("useCommentServices tests", () => {
    it.each([
        { name: "creates a comment with 'Random comment content' as text content", text: "Random comment content"},
        { name: "does not create a comment with empty text content", text: ""},
        { name: "does not create a comment with only spaces as text content", text: " "},
    ])("$name", ({ text }) => {
        const { result } = renderHook(() => useCommentServices());

        const trimmedText = text.trim();

        act(() => {
            result.current.createComment({ text });
        });

        if (trimmedText) {
            expect(useFetchApiCallMock.fetchExecute).toHaveBeenCalled();
        } else {
            expect(useFetchApiCallMock.fetchExecute).not.toHaveBeenCalled();
        };
    });

    it.each([
        { name: "updates a comment with 'Random comment content' as text content", text: "Random comment content"},
        { name: "does not update a comment with empty text content", text: ""},
        { name: "does not update a comment with only spaces as text content", text: " "},
    ])("$name", ({ text }) => {
        const { result } = renderHook(() => useCommentServices());

        const commentId = "123";
        const trimmedText = text.trim();

        act(() => {
            result.current.updateComment( commentId, text );
        });

        if (trimmedText) {
            expect(useFetchApiCallMock.fetchExecute).toHaveBeenCalled();
        } else {
            expect(useFetchApiCallMock.fetchExecute).not.toHaveBeenCalled();
        };
    });

    it("deletes a comment", () => {
        const { result } = renderHook(() => useCommentServices());

        const commentId = "123";;

        act(() => {
            result.current.deleteComment( commentId );
        });

        expect(useFetchApiCallMock.fetchExecute).toHaveBeenCalled();
    });
});