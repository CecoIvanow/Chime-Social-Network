import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, } from "vitest";

import { AlertContext } from "../../../../contexts/alert-context";
import { PostContext } from "../../../../contexts/post-context";
import { UserContext } from "../../../../contexts/user-context";

import CreateCommentForm from "./CommentCreateForm";

vi.mock("../../../shared/input-fields/create-content-input-field/CreateContentInputField", () => ({
    default: ({ onSubmitHandler, onTextChangeHandler, buttonText, text }) => <>
        <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            onSubmitHandler(formData);
        }}>
            <input
                type="text"
                onChange={onTextChangeHandler}
                id="comment"
                value={text}
                data-testid="input"
                name="content"
            >
            </input>

            <button data-testid="button" type="submit">{buttonText}</button>
        </form>
    </>
}));

vi.mock("../../../../hooks/useCommentServices", () => ({
    default: () => ({
        ...useCommentServicesMock
    })
}));

const BUTTON_TEXT = "Reply";
const INITIAL_INPUT_VALUE = "";

const CREATE_COMMENT_ERROR_MSG = "Successfully rejected createComment call!";

const isUser = "User123";

const newComment = {
    _id: 3,
    content: "The new comment",
};

const setAlert = vi.fn();

const useCommentServicesMock = {
    createComment: vi.fn(),
    abortAll: vi.fn(),
};

const postContextMock = {
    setPost: vi.fn(),
    post: {
        comments: [
            { _id: 1, content: "First comment!", onPost: "3dadew", owner: "User2" },
        ]
    },
};

function setup(options = {
    createCommentSuccess: true,
    createCommentTruthyReturn: true
}) {
    if (!options.createCommentSuccess) {
        useCommentServicesMock.createComment.mockRejectedValue(new Error(CREATE_COMMENT_ERROR_MSG));
    } else if (options.createCommentTruthyReturn) {
        useCommentServicesMock.createComment.mockResolvedValue(newComment);
    } else {
        useCommentServicesMock.createComment.mockResolvedValue("");
    };

    render(
        <AlertContext.Provider value={{ setAlert }}>
            <UserContext.Provider value={{ isUser }}>
                <PostContext.Provider value={{ ...postContextMock }}>
                    <CreateCommentForm />
                </PostContext.Provider>
            </UserContext.Provider>
        </AlertContext.Provider>
    );
};

describe("CommentCreateForm component", () => {
    it("renders CommentCreateForm with passed props", () => {
        setup();

        expect(screen.getByTestId("button")).toHaveTextContent(BUTTON_TEXT);
        expect(screen.getByTestId("input")).toHaveValue(INITIAL_INPUT_VALUE);
    });

    it("on value change triggers onTextChangeHandler", () => {
        setup();

        const newValue = "test";

        const inputEl = screen.getByTestId("input");

        fireEvent.change(inputEl, { target: { value: newValue } });

        expect(inputEl).toHaveValue(newValue);
    });

    it("on successfull createComment call updates post comments array", async () => {
        setup();

        const initialCommentsLen = postContextMock.post.comments.length;

        const newValue = "test";

        const inputEl = screen.getByTestId("input");

        fireEvent.change(inputEl, { target: { value: newValue } });
        fireEvent.click(screen.getByTestId("button"));

        await waitFor(() => {
            const updatedPost = postContextMock.setPost.mock.calls[0][0];

            expect(updatedPost.comments).toHaveLength(initialCommentsLen + 1);
        });

        expect(setAlert).not.toHaveBeenCalled();
    });

    it("exits on empty createComment return value", async () => {
        setup({
            createCommentSuccess: true,
            createCommentTruthyReturn: false
        });

        const newValue = "test";

        const inputEl = screen.getByTestId("input");

        fireEvent.change(inputEl, { target: { value: newValue } });
        fireEvent.click(screen.getByTestId("button"));

        await waitFor(() => {
            expect(useCommentServicesMock.createComment).toHaveBeenCalled();
        });

        expect(inputEl).toHaveValue(newValue);
        expect(postContextMock.setPost).not.toHaveBeenCalled();
        expect(setAlert).not.toHaveBeenCalled();
    });

    it("on rejected createComment call triggers setAlert", async () => {
        setup({
            createCommentSuccess: false,
            createCommentTruthyReturn: true,
        });

        fireEvent.click(screen.getByTestId("button"));

        await waitFor(() => {
            expect(setAlert).toHaveBeenCalledWith(CREATE_COMMENT_ERROR_MSG);
        });
    });
});