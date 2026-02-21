import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AlertContext } from "../../../../contexts/alert-context";
import { TotalPostsContext } from "../../../../contexts/total-posts-context";
import { UserContext } from "../../../../contexts/user-context";

import PostCreateForm from "./PostCreateForm";

vi.mock("../../../../hooks/usePostServices", () => ({
    default: () => ({
        ...usePostServicesMock
    })
}));

vi.mock("../../input-fields/create-content-input-field/CreateContentInputField", () => ({
    default: ({ text, buttonText, onTextChangeHandler, onSubmitHandler }) => (
        <form
            data-testid="form"
            onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData();
                formData.set("text", text);
                onSubmitHandler(formData);
            }}
        >
            <input
                value={text}
                onChange={onTextChangeHandler}
                type="text"
                data-testid="create-content-input-field"
            />
            <button type="submit">
                {buttonText}
            </button>
        </form>
    )
}));

const resolvedPostValue = { postId: 3 };
const newInputValue = "This is a test!";

const isUser = 42;

const ERR_MSG = {
    CREATE_POST: "Rejected createPost API call"
}

const usePostServicesMock = {
    abortAll: vi.fn(),
    createPost: vi.fn(),
};

const totalPostsCtxProps = {
    setTotalPosts: vi.fn(),
    totalPosts: [
        { postId: 1 },
        { postId: 2 },
    ],
};

const setAlert = vi.fn();

function setup(options = {
    createPostReturnSuccess: true,
    createPostEmptyReturn: false
}) {
    if (!options.createPostReturnSuccess) {
        usePostServicesMock.createPost.mockRejectedValue(new Error(ERR_MSG.CREATE_POST));
    } else if (options.createPostEmptyReturn) {
        usePostServicesMock.createPost.mockResolvedValue(undefined);
    } else {
        usePostServicesMock.createPost.mockResolvedValue(resolvedPostValue);
    }

    return render(
        <AlertContext.Provider value={{ setAlert, }}>
            <UserContext.Provider value={{ isUser, }}>
                <TotalPostsContext.Provider value={totalPostsCtxProps}>
                    <PostCreateForm />
                </TotalPostsContext.Provider>
            </UserContext.Provider>
        </AlertContext.Provider>
    );
};

describe("PostCreateForm component", () => {
    it("renders post creation form with Post button", () => {
        setup();

        expect(screen.getByRole("textbox")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Post" })).toBeInTheDocument();
    });

    it("updates input text on user typing", async () => {
        const user = userEvent.setup();
        setup();

        const inputField = screen.getByRole("textbox");

        expect(inputField).not.toHaveValue();

        await user.type(inputField, newInputValue);
        expect(inputField).toHaveValue(newInputValue);
    });

    it("creates a new post on form submission", async () => {
        const user = userEvent.setup();
        setup();

        await user.type(screen.getByRole("textbox"), newInputValue);
        await user.click(screen.getByRole("button", { name: "Post" }));

        await waitFor(() => {
            expect(usePostServicesMock.createPost).toHaveBeenCalledWith({
                text: newInputValue,
                owner: isUser
            });
        });
    });

    it("shows alert message on rejected post creation", async () => {
        const user = userEvent.setup();
        setup({
            createPostEmptyReturn: false,
            createPostReturnSuccess: false,
        });

        await user.type(screen.getByRole("textbox"), newInputValue);
        await user.click(screen.getByRole("button", { name: "Post" }));

        await waitFor(() => {
            expect(setAlert).toHaveBeenCalledWith(ERR_MSG.CREATE_POST);
        });
    });

    it("adds the newly created post and resets the input text field to empty", async () => {
        const user = userEvent.setup();
        setup();

        const input = screen.getByRole("textbox");

        await user.type(input, newInputValue);
        await user.click(screen.getByRole("button", { name: "Post" }));

        await waitFor(() => {
            expect(totalPostsCtxProps.setTotalPosts).toHaveBeenCalledWith([
                resolvedPostValue,
                ...totalPostsCtxProps.totalPosts
            ]);
        });

        expect(input).toHaveValue("");
    });

    it("does nothing when the post creation fails", async () => {
        const user = userEvent.setup();
        setup({
            createPostEmptyReturn: true,
            createPostReturnSuccess: true,
        });

        const input = screen.getByRole("textbox");

        await user.type(input, newInputValue);
        await user.click(screen.getByRole("button", { name: "Post" }));

        await waitFor(() => {
            expect(usePostServicesMock.createPost).toHaveBeenCalledWith({
                text: newInputValue,
                owner: isUser
            });
        });

        expect(totalPostsCtxProps.setTotalPosts).not.toHaveBeenCalled();
        expect(input).toHaveValue(newInputValue);
    });

    it("stops all ongoing calls on unmount", async () => {
        const { unmount } = setup({
            createPostEmptyReturn: false,
            createPostReturnSuccess: true,
        });

        unmount();

        expect(usePostServicesMock.abortAll).toHaveBeenCalled();
    });
});
