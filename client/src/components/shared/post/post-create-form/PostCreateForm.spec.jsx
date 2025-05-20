import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import PostCreateForm from "./PostCreateForm";

import { AlertContext } from "../../../../contexts/alert-context";
import { TotalPostsContext } from "../../../../contexts/total-posts-context";
import { UserContext } from "../../../../contexts/user-context";

const mockPosts = [
    { postId: 1 },
    { postId: 2 }
]

const mockIsUser = 42;

const mockUsePostServices = {
    abortAll: vi.fn(),
    createPost: vi.fn(),
}

const mockTotalPostsCtxValue = {
    totalPosts: mockPosts,
    setTotalPosts: vi.fn(),
}

const mockSetAlert = vi.fn();

vi.mock("../../input-fields/create-content-input-field/CreateContentInputField", () => ({
    default: ({ text, buttonText, onTextChangeHandler, onSubmitHandler }) => (
        <form
            data-testid="form"
            onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData();
                formData.set('text', text);
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
        abortAll: mockUsePostServices.abortAll,
        createPost: mockUsePostServices.createPost,
    })
}));

beforeEach(() => {
    mockTotalPostsCtxValue.setTotalPosts.mockClear();
    mockUsePostServices.createPost.mockClear();
    mockSetAlert.mockClear();
})

describe('PostCreateForm component', () => {
    it('renders CreateContentInputField with default buttonText prop', () => {
        render(
            <AlertContext.Provider value={{ setAlert: mockSetAlert }}>
                <UserContext.Provider value={{ isUser: mockIsUser }}>
                    <TotalPostsContext.Provider value={mockTotalPostsCtxValue}>
                        <PostCreateForm />
                    </TotalPostsContext.Provider>
                </UserContext.Provider>
            </AlertContext.Provider>
        );

        const inputField = screen.getByTestId("create-content-input-field");
        const button = screen.getByText('Post');

        expect(inputField).toBeInTheDocument();

        expect(button).toBeInTheDocument();
    });

    it('updates postText on input change', () => {
        render(
            <AlertContext.Provider value={{ setAlert: mockSetAlert }}>
                <UserContext.Provider value={{ isUser: mockIsUser }}>
                    <TotalPostsContext.Provider value={mockTotalPostsCtxValue}>
                        <PostCreateForm />
                    </TotalPostsContext.Provider>
                </UserContext.Provider>
            </AlertContext.Provider>
        );

        const inputField = screen.getByTestId("create-content-input-field");

        expect(inputField).not.toHaveValue();

        fireEvent.change(inputField, { target: { value: 'R' } });
        expect(inputField).toHaveValue('R');
    });

    it('calls createPost on submit and returns a new post', async () => {
        mockUsePostServices.createPost.mockResolvedValue({ postId: 3 });

        render(
            <AlertContext.Provider value={{ setAlert: mockSetAlert }}>
                <UserContext.Provider value={{ isUser: mockIsUser }}>
                    <TotalPostsContext.Provider value={mockTotalPostsCtxValue}>
                        <PostCreateForm />
                    </TotalPostsContext.Provider>
                </UserContext.Provider>
            </AlertContext.Provider>
        );

        const input = screen.getByTestId("create-content-input-field");
        const form = screen.getByTestId('form');

        fireEvent.change(input, { target: { value: "Test Post" } });
        expect(mockUsePostServices.createPost).toHaveBeenCalledTimes(0);

        fireEvent.submit(form);
        await waitFor(() => {
            expect(mockUsePostServices.createPost).toHaveBeenCalledTimes(1);
            expect(mockUsePostServices.createPost).toHaveBeenCalledWith({
                text: 'Test Post',
                owner: mockIsUser
            })
        })
    });

    it('sets setAlert on createPost rejection', async () => {
        mockUsePostServices.createPost.mockRejectedValue(new Error('Fail test!'))

        render(
            <AlertContext.Provider value={{ setAlert: mockSetAlert }}>
                <UserContext.Provider value={{ isUser: mockIsUser }}>
                    <TotalPostsContext.Provider value={mockTotalPostsCtxValue}>
                        <PostCreateForm />
                    </TotalPostsContext.Provider>
                </UserContext.Provider>
            </AlertContext.Provider>
        );

        const input = screen.getByTestId("create-content-input-field");
        const form = screen.getByTestId('form');

        fireEvent.change(input, { target: { value: "Test Post" } });

        fireEvent.change(input, { target: { value: "Test Post" } });
        expect(mockUsePostServices.createPost).toHaveBeenCalledTimes(0);
        expect(mockSetAlert).toHaveBeenCalledTimes(0);

        fireEvent.submit(form);
        await waitFor(() => {
            expect(mockUsePostServices.createPost).toHaveBeenCalledTimes(1);
            expect(mockSetAlert).toHaveBeenCalledTimes(1);
            expect(mockSetAlert).toHaveBeenCalledWith('Fail test!');
        })
    });

    it('calls setTotalPosts and setPostText on resolved createPost', async () => {
        mockUsePostServices.createPost.mockResolvedValue({ postId: 3 });

        render(
            <AlertContext.Provider value={{ setAlert: mockSetAlert }}>
                <UserContext.Provider value={{ isUser: mockIsUser }}>
                    <TotalPostsContext.Provider value={mockTotalPostsCtxValue}>
                        <PostCreateForm />
                    </TotalPostsContext.Provider>
                </UserContext.Provider>
            </AlertContext.Provider>
        );

        const input = screen.getByTestId("create-content-input-field");
        const form = screen.getByTestId('form');

        fireEvent.change(input, { target: { value: "Test Post" } });
        expect(mockUsePostServices.createPost).toHaveBeenCalledTimes(0);
        expect(mockTotalPostsCtxValue.setTotalPosts).toHaveBeenCalledTimes(0);

        fireEvent.submit(form);
        await waitFor(() => {
            expect(mockUsePostServices.createPost).toHaveBeenCalledTimes(1);
            expect(mockTotalPostsCtxValue.setTotalPosts).toHaveBeenCalledTimes(1);
            expect(input).toHaveValue('');
        });
    });

    it('onPostSubmitHandler returns on falsy newPost value', async () => {
        mockUsePostServices.createPost.mockResolvedValue(undefined);

        render(
            <AlertContext.Provider value={{ setAlert: mockSetAlert }}>
                <UserContext.Provider value={{ isUser: mockIsUser }}>
                    <TotalPostsContext.Provider value={mockTotalPostsCtxValue}>
                        <PostCreateForm />
                    </TotalPostsContext.Provider>
                </UserContext.Provider>
            </AlertContext.Provider>
        );

        const input = screen.getByTestId("create-content-input-field");
        const form = screen.getByTestId('form');

        fireEvent.change(input, { target: { value: "Test Post" } });
        fireEvent.submit(form);

        await waitFor(() => {
            expect(mockUsePostServices.createPost).toHaveBeenCalledTimes(1);
            expect(mockUsePostServices.createPost).toHaveBeenCalledWith({
                text: 'Test Post',
                owner: mockIsUser
            });
            expect(mockTotalPostsCtxValue.setTotalPosts).toHaveBeenCalledTimes(0);
            expect(input).toHaveValue('Test Post');
        });
    });

    it('calls abortAll on unmount', () => {
        mockUsePostServices.createPost.mockResolvedValue(undefined);

        const { unmount } = render(
            <AlertContext.Provider value={{ setAlert: mockSetAlert }}>
                <UserContext.Provider value={{ isUser: mockIsUser }}>
                    <TotalPostsContext.Provider value={mockTotalPostsCtxValue}>
                        <PostCreateForm />
                    </TotalPostsContext.Provider>
                </UserContext.Provider>
            </AlertContext.Provider>
        );

        const input = screen.getByTestId("create-content-input-field");
        const form = screen.getByTestId('form');

        fireEvent.change(input, { target: { value: "Test Post" } });
        fireEvent.submit(form);

        unmount();

        expect(mockUsePostServices.abortAll).toHaveBeenCalled();
    })
})
