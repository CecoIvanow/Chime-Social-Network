import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { AlertContext } from "../../../../contexts/alert-context";
import { TotalPostsContext } from "../../../../contexts/total-posts-context";
import { UserContext } from "../../../../contexts/user-context";

import PostCreateForm from "./PostCreateForm";

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
                data-testid="create-content-input-field"
            />
            <button>
                {buttonText}
            </button>
        </form>
    )
}));

vi.mock("../../../../hooks/usePostServices", () => ({
    default: () => ({
        abortAll: usePostServicesMock.abortAll,
        createPost: usePostServicesMock.createPost,
    })
}));

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

describe("PostCreateForm component", () => {
    it("renders CreateContentInputField with default buttonText prop", () => {
        render(
            <AlertContext.Provider value={{ setAlert, }}>
                <UserContext.Provider value={{ isUser, }}>
                    <TotalPostsContext.Provider value={totalPostsCtxProps}>
                        <PostCreateForm />
                    </TotalPostsContext.Provider>
                </UserContext.Provider>
            </AlertContext.Provider>
        );

        const inputField = screen.getByTestId("create-content-input-field");
        const button = screen.getByText("Post");

        expect(inputField).toBeInTheDocument();

        expect(button).toBeInTheDocument();
    });

    it("updates postText on input change", () => {
        render(
            <AlertContext.Provider value={{ setAlert: setAlert }}>
                <UserContext.Provider value={{ isUser: isUser }}>
                    <TotalPostsContext.Provider value={totalPostsCtxProps}>
                        <PostCreateForm />
                    </TotalPostsContext.Provider>
                </UserContext.Provider>
            </AlertContext.Provider>
        );

        const inputField = screen.getByTestId("create-content-input-field");

        expect(inputField).not.toHaveValue();

        fireEvent.change(inputField, { target: { value: "R" } });
        expect(inputField).toHaveValue("R");
    });

    it("calls createPost on submit and returns a new post", async () => {
        usePostServicesMock.createPost.mockResolvedValue({ postId: 3 });

        render(
            <AlertContext.Provider value={{ setAlert: setAlert }}>
                <UserContext.Provider value={{ isUser: isUser }}>
                    <TotalPostsContext.Provider value={totalPostsCtxProps}>
                        <PostCreateForm />
                    </TotalPostsContext.Provider>
                </UserContext.Provider>
            </AlertContext.Provider>
        );

        const input = screen.getByTestId("create-content-input-field");
        const form = screen.getByTestId("form");

        fireEvent.change(input, { target: { value: "Test Post" } });
        expect(usePostServicesMock.createPost).toHaveBeenCalledTimes(0);

        fireEvent.submit(form);
        await waitFor(() => {
            expect(usePostServicesMock.createPost).toHaveBeenCalledTimes(1);
            expect(usePostServicesMock.createPost).toHaveBeenCalledWith({
                text: "Test Post",
                owner: isUser
            })
        })
    });

    it("sets setAlert on createPost rejection", async () => {
        usePostServicesMock.createPost.mockRejectedValue(new Error("Successful test failure!"))

        render(
            <AlertContext.Provider value={{ setAlert: setAlert }}>
                <UserContext.Provider value={{ isUser: isUser }}>
                    <TotalPostsContext.Provider value={totalPostsCtxProps}>
                        <PostCreateForm />
                    </TotalPostsContext.Provider>
                </UserContext.Provider>
            </AlertContext.Provider>
        );

        const input = screen.getByTestId("create-content-input-field");
        const form = screen.getByTestId("form");

        fireEvent.change(input, { target: { value: "Test Post" } });

        fireEvent.change(input, { target: { value: "Test Post" } });
        expect(usePostServicesMock.createPost).toHaveBeenCalledTimes(0);
        expect(setAlert).toHaveBeenCalledTimes(0);

        fireEvent.submit(form);
        await waitFor(() => {
            expect(usePostServicesMock.createPost).toHaveBeenCalledTimes(1);
            expect(setAlert).toHaveBeenCalledTimes(1);
            expect(setAlert).toHaveBeenCalledWith("Successful test failure!");
        })
    });

    it("calls setTotalPosts and setPostText on resolved createPost", async () => {
        usePostServicesMock.createPost.mockResolvedValue({ postId: 3 });

        render(
            <AlertContext.Provider value={{ setAlert: setAlert }}>
                <UserContext.Provider value={{ isUser: isUser }}>
                    <TotalPostsContext.Provider value={totalPostsCtxProps}>
                        <PostCreateForm />
                    </TotalPostsContext.Provider>
                </UserContext.Provider>
            </AlertContext.Provider>
        );

        const input = screen.getByTestId("create-content-input-field");
        const form = screen.getByTestId("form");

        fireEvent.change(input, { target: { value: "Test Post" } });
        expect(usePostServicesMock.createPost).toHaveBeenCalledTimes(0);
        expect(totalPostsCtxProps.setTotalPosts).toHaveBeenCalledTimes(0);

        fireEvent.submit(form);
        await waitFor(() => {
            expect(usePostServicesMock.createPost).toHaveBeenCalledTimes(1);
            expect(totalPostsCtxProps.setTotalPosts).toHaveBeenCalledTimes(1);
            expect(input).toHaveValue("");
        });
    });

    it("onPostSubmitHandler returns on falsy newPost value", async () => {
        usePostServicesMock.createPost.mockResolvedValue(undefined);

        render(
            <AlertContext.Provider value={{ setAlert: setAlert }}>
                <UserContext.Provider value={{ isUser: isUser }}>
                    <TotalPostsContext.Provider value={totalPostsCtxProps}>
                        <PostCreateForm />
                    </TotalPostsContext.Provider>
                </UserContext.Provider>
            </AlertContext.Provider>
        );

        const input = screen.getByTestId("create-content-input-field");
        const form = screen.getByTestId("form");

        fireEvent.change(input, { target: { value: "Test Post" } });
        fireEvent.submit(form);

        await waitFor(() => {
            expect(usePostServicesMock.createPost).toHaveBeenCalledTimes(1);
            expect(usePostServicesMock.createPost).toHaveBeenCalledWith({
                text: "Test Post",
                owner: isUser
            });
            expect(totalPostsCtxProps.setTotalPosts).toHaveBeenCalledTimes(0);
            expect(input).toHaveValue("Test Post");
        });
    });

    it("calls abortAll on unmount", () => {
        usePostServicesMock.createPost.mockResolvedValue(undefined);

        const { unmount } = render(
            <AlertContext.Provider value={{ setAlert: setAlert }}>
                <UserContext.Provider value={{ isUser: isUser }}>
                    <TotalPostsContext.Provider value={totalPostsCtxProps}>
                        <PostCreateForm />
                    </TotalPostsContext.Provider>
                </UserContext.Provider>
            </AlertContext.Provider>
        );

        const input = screen.getByTestId("create-content-input-field");
        const form = screen.getByTestId("form");

        fireEvent.change(input, { target: { value: "Test Post" } });
        fireEvent.submit(form);

        unmount();

        expect(usePostServicesMock.abortAll).toHaveBeenCalled();
    })
})
