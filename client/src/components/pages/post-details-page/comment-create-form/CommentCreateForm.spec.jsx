import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, } from "vitest";

import { AlertContext } from "../../../../contexts/alert-context";
import { PostContext } from "../../../../contexts/post-context";
import { UserContext } from "../../../../contexts/user-context";

import CreateCommentForm from "./CommentCreateForm";

vi.mock("../../../shared/input-fields/create-content-input-field/CreateContentInputField", () => ({
    default: ({ onSubmitHandler, onTextChangeHandler, buttonText, text }) => (
        <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            onSubmitHandler(formData);
        }}>
            <label htmlFor="comment">{"Comment"}</label>
            <input
                type="text"
                onChange={onTextChangeHandler}
                id="comment"
                value={text}
                name="content"
            >
            </input>

            <button type="submit">{buttonText}</button>
        </form>
    )
}));

vi.mock("../../../../hooks/useCommentServices", () => ({
    default: () => ({
        ...useCommentServicesMock
    })
}));

const BUTTON_TEXT = "Reply";
const INITIAL_INPUT_VALUE = "";

const CREATE_COMMENT_ERROR_MSG = "Rejected createComment call!";

const updatedInputValue = "Testing!";

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
    createCommentEmptyReturn: false
}) {
    if (!options.createCommentSuccess) {
        useCommentServicesMock.createComment.mockRejectedValue(new Error(CREATE_COMMENT_ERROR_MSG));
    } else if (options.createCommentEmptyReturn) {
        useCommentServicesMock.createComment.mockResolvedValue("");
    } else {
        useCommentServicesMock.createComment.mockResolvedValue(newComment);
    };

    const { unmount } = render(
        <AlertContext.Provider value={{ setAlert }}>
            <UserContext.Provider value={{ isUser }}>
                <PostContext.Provider value={{ ...postContextMock }}>
                    <CreateCommentForm />
                </PostContext.Provider>
            </UserContext.Provider>
        </AlertContext.Provider>
    );

    return { unmount };
};

describe("CommentCreateForm component", () => {
    it("renders create comment form with initial value and submit button", () => {
        setup();

        expect(screen.getByRole("button", {name: BUTTON_TEXT})).toBeInTheDocument();
        expect(screen.getByLabelText("Comment")).toHaveValue(INITIAL_INPUT_VALUE);
    });

    it("updates form input value on change", async () => {
        const user = userEvent.setup();
        setup();

        const inputEl = screen.getByLabelText("Comment");

        await user.type(inputEl, updatedInputValue);
        expect(inputEl).toHaveValue(updatedInputValue);
    });

    it("adds new comment after successfull comment creation", async () => {
        const user = userEvent.setup();
        setup();

        const initialCommentsLen = postContextMock.post.comments.length;

        const inputEl = screen.getByLabelText("Comment");

        await user.type(inputEl, updatedInputValue);
        await user.click(screen.getByRole("button", { name: BUTTON_TEXT }));

        await waitFor(() => {
            const updatedPost = postContextMock.setPost.mock.calls[0][0];

            expect(updatedPost.comments).toHaveLength(initialCommentsLen + 1);
        });

        expect(setAlert).not.toHaveBeenCalled();
    });

    it("does nothing when comment creation returns nothing", async () => {
        const user = userEvent.setup();
        setup({
            createCommentSuccess: true,
            createCommentEmptyReturn: true
        });

        const inputEl = screen.getByLabelText("Comment");

        await user.type(inputEl, updatedInputValue);
        await user.click(screen.getByRole("button", { name: BUTTON_TEXT }));

        await waitFor(() => {
            expect(useCommentServicesMock.createComment).toHaveBeenCalled();
        });

        expect(inputEl).toHaveValue(updatedInputValue);
        expect(postContextMock.setPost).not.toHaveBeenCalled();
        expect(setAlert).not.toHaveBeenCalled();
    });

    it("shows error message on a rejected comment creation call", async () => {
        const user = userEvent.setup();
        setup({
            createCommentSuccess: false,
            createCommentEmptyReturn: false,
        });

        await user.click(screen.getByRole("button", { name: BUTTON_TEXT }));

        await waitFor(() => {
            expect(setAlert).toHaveBeenCalledWith(CREATE_COMMENT_ERROR_MSG);
        });
    });

    it("stops all ongoing comment creation calls on component unmount", () => {
        const { unmount } = setup();

        unmount();

        expect(useCommentServicesMock.abortAll).toHaveBeenCalled();
    });
});