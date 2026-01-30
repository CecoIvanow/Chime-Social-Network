import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AlertContext } from "../../../../contexts/alert-context";
import { TotalPostsContext } from "../../../../contexts/total-posts-context";
import { UserContext } from "../../../../contexts/user-context";

import PostCreateForm from "./PostCreateForm";

vi.mock("../../../../hooks/usePostServices", () => ({
    default: () => ({
        abortAll: usePostServicesMock.abortAll,
        createPost: usePostServicesMock.createPost,
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

const newInputValue = "This is a test!";

const isUser = 42;

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

function setup() {
    const { unmount } = render(
        <AlertContext.Provider value={{ setAlert, }}>
            <UserContext.Provider value={{ isUser, }}>
                <TotalPostsContext.Provider value={totalPostsCtxProps}>
                    <PostCreateForm />
                </TotalPostsContext.Provider>
            </UserContext.Provider>
        </AlertContext.Provider>
    );

    return { unmount }
};

describe("PostCreateForm component", () => {
    it("renders post creation form", () => {
        setup();

        expect(screen.getByRole("textbox")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Post" })).toBeInTheDocument();
    });

    it("updates postText on input change", async () => {
        const user = userEvent.setup();
        setup();

        const inputField = screen.getByRole("textbox");

        expect(inputField).not.toHaveValue();

        await user.type(inputField, newInputValue);
        expect(inputField).toHaveValue(newInputValue);
    });

    it("calls createPost on submit and returns a new post", async () => {
        const user = userEvent.setup();
        setup();

        usePostServicesMock.createPost.mockResolvedValue({ postId: 3 });

        const input = screen.getByRole("textbox");

        await user.type(input, newInputValue);
        expect(usePostServicesMock.createPost).toHaveBeenCalledTimes(0);

        await user.click(screen.getByRole("button", { name: "Post" }));
        await waitFor(() => {
            expect(usePostServicesMock.createPost).toHaveBeenCalledTimes(1);
            expect(usePostServicesMock.createPost).toHaveBeenCalledWith({
                text: newInputValue,
                owner: isUser
            })
        })
    });

    it("sets setAlert on createPost rejection", async () => {
        const user = userEvent.setup();
        setup();

        usePostServicesMock.createPost.mockRejectedValue(new Error("Successful test failure!"))

        const input = screen.getByRole("textbox");

        await user.type(input, newInputValue);
        expect(usePostServicesMock.createPost).toHaveBeenCalledTimes(0);
        expect(setAlert).toHaveBeenCalledTimes(0);

        user.click(screen.getByRole("button", { name: "Post" }));
        await waitFor(() => {
            expect(usePostServicesMock.createPost).toHaveBeenCalledTimes(1);
            expect(setAlert).toHaveBeenCalledTimes(1);
            expect(setAlert).toHaveBeenCalledWith("Successful test failure!");
        })
    });

    it("calls setTotalPosts and setPostText on resolved createPost", async () => {
        const user = userEvent.setup();
        setup();

        usePostServicesMock.createPost.mockResolvedValue({ postId: 3 });

        const input = screen.getByRole("textbox");

        await user.type(input, newInputValue);
        expect(usePostServicesMock.createPost).toHaveBeenCalledTimes(0);
        expect(totalPostsCtxProps.setTotalPosts).toHaveBeenCalledTimes(0);

        user.click(screen.getByRole("button", { name: "Post" }));
        await waitFor(() => {
            expect(usePostServicesMock.createPost).toHaveBeenCalledTimes(1);
            expect(totalPostsCtxProps.setTotalPosts).toHaveBeenCalledTimes(1);
            expect(input).toHaveValue("");
        });
    });

    it("onPostSubmitHandler returns on falsy newPost value", async () => {
        const user = userEvent.setup();
        setup();

        usePostServicesMock.createPost.mockResolvedValue(undefined);

        const input = screen.getByRole("textbox");

        await user.type(input, newInputValue);
        await user.click(screen.getByRole("button", { name: "Post" }));

        await waitFor(() => {
            expect(usePostServicesMock.createPost).toHaveBeenCalledTimes(1);
            expect(usePostServicesMock.createPost).toHaveBeenCalledWith({
                text: newInputValue,
                owner: isUser
            });
            expect(totalPostsCtxProps.setTotalPosts).toHaveBeenCalledTimes(0);
            expect(input).toHaveValue(newInputValue);
        });
    });

    it("calls abortAll on unmount", async () => {
        const user = userEvent.setup();
        const { unmount } = setup();

        usePostServicesMock.createPost.mockResolvedValue(undefined);

        const input = screen.getByRole("textbox");

        await user.type(input, newInputValue);
        await user.click(screen.getByRole("button", { name: "Post" }));

        unmount();

        expect(usePostServicesMock.abortAll).toHaveBeenCalled();
    })
})
