import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import CreateCommentForm from "./CommentCreateForm";

import { PostContext } from "../../../../contexts/post-context";
import { UserContext } from "../../../../contexts/user-context";
import { AlertContext } from "../../../../contexts/alert-context";

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
}))

vi.mock("../../../../hooks/useCommentServices", () => ({
    default: () => ({
        createComment: createCommentMock,
        abortAll: abortAllMock,
    })
}))

const createCommentMock = vi.fn();
const abortAllMock = vi.fn();

const setAlert = vi.fn();

const setPost = vi.fn();
const post = {
    comments: [
        { _id: 1, content: "First comment!", onPost: "3dadew", owner: "User2" },
    ]
};

const isUser = "User123";

const newComment = {
    _id: 3,
    content: "The new comment",
}

const BUTTON_TEXT = "Reply";
const INITIAL_INPUT_VALUE = "";

const CREATE_COMMENT_ERROR_MSG = "Successfully rejected createComment call!"

function setup(options = {
    createCommentSuccess: true,
    createCommentTruthyReturn: true
}) {
    if (!options.createCommentSuccess) {
        createCommentMock.mockRejectedValue(new Error(CREATE_COMMENT_ERROR_MSG));
    } else if (options.createCommentTruthyReturn) {
        createCommentMock.mockResolvedValue(newComment);
    } else {
        createCommentMock.mockResolvedValue("");
    }

    render(
        <AlertContext.Provider value={{ setAlert }}>
            <UserContext.Provider value={{ isUser }}>
                <PostContext.Provider value={{ post, setPost }}>
                    <CreateCommentForm />
                </PostContext.Provider>
            </UserContext.Provider>
        </AlertContext.Provider>
    )
}

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

        const initialCommentsLen = post.comments.length;

        const newValue = "test";

        const inputEl = screen.getByTestId("input");

        fireEvent.change(inputEl, { target: { value: newValue } });
        fireEvent.click(screen.getByTestId("button"));

        await waitFor(() => {
            const updatedPost = setPost.mock.calls[0][0];            

            expect(updatedPost.comments).toHaveLength(initialCommentsLen + 1);
        })
    });

    it("exits on empty createComment return value", async () => {
        setup({
            createCommentTruthyReturn: false
        });

        const newValue = "test";

        const inputEl = screen.getByTestId("input");

        fireEvent.change(inputEl, { target: { value: newValue } });
        fireEvent.click(screen.getByTestId("button"));

        await waitFor(() => {
            expect(setPost).not.toHaveBeenCalled();
        })
    })

    it("on rejected createComment call triggers setAlert", async () => {
        setup({
            createCommentSuccess: false
        });

        fireEvent.click(screen.getByTestId("button"));

        await waitFor(() => {
            expect(setAlert).toHaveBeenCalledWith(CREATE_COMMENT_ERROR_MSG);
        })
    })
});