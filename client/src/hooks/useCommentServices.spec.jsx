import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import useCommentServices from "./useCommentServices";
import userEvent from "@testing-library/user-event";

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

function Component({
    payload,
}) {
    const {
        // abortAll,
        createComment,
        // deleteComment,
        // updateComment,
        // isLoading
    } = useCommentServices();

    return (
        <>
            <button onClick={() => createComment(payload)}>Create</button>
        </>
    );
};

function setup(options = {
    isPayloadEmptyText: false,
}) {
    const payloadText = {
        text: options.isPayloadEmptyText ? " " : "Some Text"
    }

    render(
        <Component payload={payloadText} />
    );
};