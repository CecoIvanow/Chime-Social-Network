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

        act(() => {
            result.current.createComment({ text });
        });

        if (text.trim()) {
            expect(useFetchApiCallMock.fetchExecute).toHaveBeenCalled();
        } else {
            expect(useFetchApiCallMock.fetchExecute).not.toHaveBeenCalled();
        };
    });
});