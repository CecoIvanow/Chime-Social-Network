import { useContext } from "react";

import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ActionsContext } from "../../../contexts/actions-context";
import { AlertContext } from "../../../contexts/alert-context";
import { PostContext } from "../../../contexts/post-context";
import { UserContext } from "../../../contexts/user-context";

import PostDetailsPage from "./PostDetailsPage";

vi.mock("./comment-create-form/CommentCreateForm", () => ({
    default: () => <div data-testid="comment-create-form"></div>
}));

vi.mock("./comments-section/CommentsSection", () => ({
    default: () => <div data-testid="comments-section" />
}));

vi.mock("./post-edit-content/PostEditContent", () => ({
    default: ({ postText, textChangeHandler }) => (
        <textarea
            onChange={(e) => textChangeHandler(e)}
            value={postText}
        >
        </textarea>
    )
}));

vi.mock("../../shared/post/post-header/PostHeader", () => ({
    default: () => <div data-testid="post-header"></div>
}));

vi.mock("../../shared/post/post-interactions/PostInteractions", () => ({
    default: () => {
        const postCtx = PostCtxConsumer();
        const actions = ActionsCtxConsumer();

        return (
            <div data-testid="post-interactions">
                <button onClick={actions.onLikeClickHandler}>Like</button>
                <button onClick={actions.onUnlikeClickHandler}>Unlike</button>
                <button onClick={actions.onEditPostClickHandler}>Edit</button>
                <button onClick={() => actions.onDeleteClickHandler(postCtx.post._id)}>Delete</button>

                {actions.isEditClicked && <>
                    <button onClick={() => actions.onSaveEditClickHandler(postCtx.post._id)}>Save</button>
                    <button onClick={actions.onCancelEditClickHandler}>Cancel</button>
                </>}
            </div>
        );
    }
}));

vi.mock("../../shared/post/post-text/PostText", () => ({
    default: ({ postText }) => <div data-testid="post-text">{postText}</div>
}));

vi.mock("../../../hooks/usePostServices", () => ({
    default: () => ({
        ...usePostServicesMock
    })
}));

vi.mock("react-router", () => ({
    useLocation: () => location,
    useNavigate: () => navigateToMock,
}));

const ERR_MSG = {
    EDIT: "Rejected editPost call!",
    DELETE: "Rejected deletePost call!",
    LIKE: "Rejected likePost call!",
    UNLIKE: "Rejected unlikePost call!",
    GET_POST: "Rejected getPostWithComments call!"
}

const POST_ID = "postId435";

const UPDATED_POST_CONTENT = "Updated Content!";

const isUser = "user123";

let location = {
    state: {
        shouldEdit: false,
    },
    pathname: `/posts/${POST_ID}`,
};

let post = {
    _id: POST_ID,
    text: "This is a post!",
    owner: {
        _id: "ownerId123",
    },
};

const usePostServicesMock = {
    deletePost: vi.fn(),
    editPost: vi.fn(),
    likePost: vi.fn(),
    unlikePost: vi.fn(),
    abortAll: vi.fn(),
    getPostWithComments: vi.fn(),
};

const navigateToMock = vi.fn();

const setAlert = vi.fn();

const ActionsCtxConsumer = () => {
    const actions = useContext(ActionsContext);
    return actions;
}

const PostCtxConsumer = () => {
    const postCtx = useContext(PostContext);
    return postCtx;
};

function setup(options = {
    getPostWithCommentsSuccess: true,
    deletePostSuccess: true,
    editPostSuccess: true,
    editPostEmptyReturnValue: false,
    likePostSuccess: true,
    unlikePostSuccess: true,
}) {
    if (!options.editPostSuccess) {
        usePostServicesMock.editPost.mockRejectedValue(new Error(ERR_MSG.EDIT));
    } else if (options.editPostEmptyReturnValue) {
        usePostServicesMock.editPost.mockResolvedValue(undefined);
    } else {
        usePostServicesMock.editPost.mockResolvedValue(UPDATED_POST_CONTENT);
    };

    options.deletePostSuccess ?
        usePostServicesMock.deletePost.mockResolvedValue() :
        usePostServicesMock.deletePost.mockRejectedValue(new Error(ERR_MSG.DELETE));

    options.likePostSuccess ?
        usePostServicesMock.likePost.mockResolvedValue() :
        usePostServicesMock.likePost.mockRejectedValue(new Error(ERR_MSG.LIKE));

    options.unlikePostSuccess ?
        usePostServicesMock.unlikePost.mockResolvedValue() :
        usePostServicesMock.unlikePost.mockRejectedValue(new Error(ERR_MSG.UNLIKE));

    options.getPostWithCommentsSuccess ?
        usePostServicesMock.getPostWithComments.mockResolvedValue(post) :
        usePostServicesMock.getPostWithComments.mockRejectedValue(new Error(ERR_MSG.GET_POST));

    const { unmount } = render(
        <AlertContext.Provider value={{ setAlert }}>
            <UserContext.Provider value={{ isUser }}>
                <PostDetailsPage />
            </UserContext.Provider>
        </AlertContext.Provider>
    );

    return unmount;
};

describe("PostDetailsPage component", () => {
    it("renders comments section, post header and post interactions components after successfull post data call on mount", async () => {
        setup();

        await waitFor(() => {
            expect(screen.getByTestId("comments-section")).toBeInTheDocument();
            expect(screen.getByTestId("post-header")).toBeInTheDocument();
            expect(screen.getByTestId("post-interactions")).toBeInTheDocument();
        });
    });

    it("renders post text with correct content after successfull post data call on mount", async () => {
        setup();

        await waitFor(() => {
            expect(screen.getByTestId("post-text")).toHaveTextContent(post.text);
        });
    });

    it("does not render on a rejected post data call", async () => {
        setup({
            getPostWithCommentsSuccess: false,
            deletePostSuccess: true,
            editPostSuccess: true,
            editPostEmptyReturnValue: false,
            likePostSuccess: true,
            unlikePostSuccess: true,
        });

        await waitFor(() => {
            expect(screen.queryByTestId("comments-section")).not.toBeInTheDocument();
            expect(screen.queryByTestId("post-header")).not.toBeInTheDocument();
            expect(screen.queryByTestId("post-text")).not.toBeInTheDocument();
            expect(screen.queryByTestId("post-interactions")).not.toBeInTheDocument();
        });
    });

    it("shows error message on a rejected post data call", async () => {
        setup({
            getPostWithCommentsSuccess: false,
            deletePostSuccess: true,
            editPostSuccess: true,
            editPostEmptyReturnValue: false,
            likePostSuccess: true,
            unlikePostSuccess: true,
        });

        await waitFor(() => {
            expect(setAlert).toHaveBeenCalledWith(ERR_MSG.GET_POST);
        });
    });

    it.each([
        { name: "deletes post and navigates to catalog after the delete confirmation window is accepted", accepted: true },
        { name: "does nothing after the delete confirmation window is cancelled", accepted: false },
    ])("$name", async ({ accepted }) => {
        const user = userEvent.setup();
        setup();

        vi.spyOn(window, "confirm").mockReturnValue(accepted);

        await user.click(await screen.findByRole("button", { name: "Delete" }));

        if (accepted) {
            await waitFor(() => {
                expect(usePostServicesMock.deletePost).toHaveBeenCalledWith(post._id);
            });

            expect(navigateToMock).toHaveBeenCalledWith('/catalog');
        } else {
            expect(usePostServicesMock.deletePost).not.toHaveBeenCalled();
            expect(navigateToMock).not.toHaveBeenCalled();
        }
    });

    it("shows error message on a rejected post deletion call", async () => {
        const user = userEvent.setup();
        setup({
            getPostWithCommentsSuccess: true,
            deletePostSuccess: false,
            editPostSuccess: true,
            editPostEmptyReturnValue: false,
            likePostSuccess: true,
            unlikePostSuccess: true,
        });

        vi.spyOn(window, "confirm").mockReturnValue(true);

        await user.click(await screen.findByRole("button", { name: "Delete" }));

        await waitFor(() => {
            expect(setAlert).toHaveBeenCalledWith(ERR_MSG.DELETE);
        });
    });

    it("successfully likes a post", async () => {
        const user = userEvent.setup();
        setup();

        await user.click(await screen.findByRole("button", { name: "Like" }));

        await waitFor(() => {
            expect(usePostServicesMock.likePost).toHaveBeenCalledWith(isUser, post._id);
        });
    });

    it("shows error message on a rejected post like call", async () => {
        const user = userEvent.setup();
        setup({
            getPostWithCommentsSuccess: true,
            deletePostSuccess: true,
            editPostSuccess: true,
            editPostEmptyReturnValue: false,
            likePostSuccess: false,
            unlikePostSuccess: true,
        });

        await user.click(await screen.findByRole("button", { name: "Like" }));

        await waitFor(() => {
            expect(setAlert).toHaveBeenCalledWith(ERR_MSG.LIKE);
        });
    });

    it("successfully unlikes a post", async () => {
        const user = userEvent.setup();
        setup();

        await user.click(await screen.findByRole("button", { name: "Unlike" }));

        await waitFor(() => {
            expect(usePostServicesMock.unlikePost).toHaveBeenCalledWith(isUser, post._id);
        });
    });

    it("shows error message on a rejected post unlike call", async () => {
        const user = userEvent.setup();
        setup({
            getPostWithCommentsSuccess: true,
            deletePostSuccess: true,
            editPostSuccess: true,
            editPostEmptyReturnValue: false,
            likePostSuccess: true,
            unlikePostSuccess: false,
        });

        await user.click(await screen.findByRole("button", { name: "Unlike" }));

        await waitFor(() => {
            expect(setAlert).toHaveBeenCalledWith(ERR_MSG.UNLIKE);
        });
    });

    it("on edit button click renders post edit textarea with original post text and with cancel and save buttons instead of post text", async () => {
        const user = userEvent.setup();
        setup();

        await user.click(await screen.findByRole("button", { name: "Edit" }));

        expect(await screen.findByRole("button", { name: "Save" })).toBeInTheDocument();
        expect(await screen.findByRole("button", { name: "Cancel" })).toBeInTheDocument();

        expect(screen.queryByTestId("post-text")).not.toBeInTheDocument();
        expect(screen.getByRole("textbox")).toHaveValue(post.text);

    });

    it("post text gets updated on user typing", async () => {
        const user = userEvent.setup();
        setup();

        await user.click(await screen.findByRole("button", { name: "Edit" }));
        await user.clear(screen.getByRole("textbox"));

        await user.type(screen.getByRole("textbox"), UPDATED_POST_CONTENT);
        expect(screen.getByRole("textbox")).toHaveValue(UPDATED_POST_CONTENT);
    });

    it("on cancel button click rerenders to post text with original content", async () => {
        const user = userEvent.setup();
        setup();

        await user.click(await screen.findByRole("button", { name: "Edit" }));
        await user.clear(screen.getByRole("textbox"));
        await user.type(screen.getByRole("textbox"), UPDATED_POST_CONTENT);

        await user.click(screen.getByRole("button", { name: "Cancel" }));

        expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
        expect(screen.getByTestId("post-text")).toHaveTextContent(post.text);
    });

    it("on save button click renders the default post text component with the updated content", async () => {
        const user = userEvent.setup();
        setup();

        await user.click(await screen.findByRole("button", { name: "Edit" }));
        await user.clear(screen.getByRole("textbox"));
        await user.type(screen.getByRole("textbox"), UPDATED_POST_CONTENT);

        await user.click(screen.getByRole("button", { name: "Save" }));

        await waitFor(() => {
            expect(usePostServicesMock.editPost).toHaveBeenCalledWith(post._id, UPDATED_POST_CONTENT);
        });

        expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    });

    it("does nothing when the save post call returns an empty value", async () => {
        const user = userEvent.setup();
        setup({
            getPostWithCommentsSuccess: true,
            deletePostSuccess: true,
            editPostSuccess: true,
            editPostEmptyReturnValue: true,
            likePostSuccess: true,
            unlikePostSuccess: true,
        });

        await user.click(await screen.findByRole("button", { name: "Edit" }));
        await user.clear(screen.getByRole("textbox"));
        await user.type(screen.getByRole("textbox"), UPDATED_POST_CONTENT);

        await user.click(screen.getByRole("button", { name: "Save" }));

        await waitFor(() => {
            expect(usePostServicesMock.editPost).toHaveBeenCalledWith(post._id, UPDATED_POST_CONTENT);
        });

        expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("shows error message on a rejected post save call", async () => {
        const user = userEvent.setup();
        setup({
            getPostWithCommentsSuccess: true,
            deletePostSuccess: true,
            editPostSuccess: false,
            editPostEmptyReturnValue: false,
            likePostSuccess: true,
            unlikePostSuccess: true,
        });

        await user.click(await screen.findByRole("button", { name: "Edit" }));
        await user.clear(screen.getByRole("textbox"));
        await user.type(screen.getByRole("textbox"), UPDATED_POST_CONTENT);

        await user.click(screen.getByRole("button", { name: "Save" }));

        await waitFor(() => {
            expect(setAlert).toHaveBeenCalledWith(ERR_MSG.EDIT);
        });
    });

    it("redirects to /404 when the user is not the owner of the post and tries to edit it", async () => {
        location = {
            state: {
                shouldEdit: true,
            },
            pathname: `/posts/${POST_ID}`,
        };

        setup();

        await waitFor(() => {
            expect(navigateToMock).toHaveBeenCalledWith("/404");
        });
    });

    it("does not redirect to /404 when the user is not the post owner and does not try to edit the post", async () => {
        setup();

        await waitFor(() => {
            expect(navigateToMock).not.toHaveBeenCalled();
        })
    });

    it("does not redirect to /404 when the user is the post owner and tries to edit the post", async () => {
        post = {
            _id: POST_ID,
            text: "This is a post!",
            owner: {
                _id: isUser,
            },
        };

        setup();

        await waitFor(() => {
            expect(navigateToMock).not.toHaveBeenCalled();
        });
    });

    it("stops all ongoing post calls on unmount", () => {
        const unmount = setup();

        unmount();
        expect(usePostServicesMock.abortAll).toHaveBeenCalled();
    });
});