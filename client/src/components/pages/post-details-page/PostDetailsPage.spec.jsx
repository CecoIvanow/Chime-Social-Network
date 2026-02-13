import { useContext } from "react";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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
            data-testid="post-text-edit"
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
                <button data-testid="like-button" onClick={actions.onLikeClickHandler}>Like</button>
                <button data-testid="unlike-button" onClick={actions.onUnlikeClickHandler}>Unlike</button>
                <button data-testid="edit-button" onClick={actions.onEditPostClickHandler}>Edit</button>
                <button data-testid="delete-button" onClick={() => actions.onDeleteClickHandler(postCtx.post._id)}>Delete</button>

                {actions.isEditClicked && <>
                    <button data-testid="save-button" onClick={() => actions.onSaveEditClickHandler(postCtx.post._id)}>Save</button>
                    <button data-testid="cancel-button" onClick={actions.onCancelEditClickHandler}>Cancel</button>
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
        { name: "deletes post and navigates to catalog after the delete confirmation window is accepted", accepted: true},
        { name: "does nothing after the delete confirmation window is cancelled", accepted: true},
    ])("$name", async ({ accepted }) => {
        setup();

        vi.spyOn(window, "confirm").mockReturnValue(accepted);

        fireEvent.click(await screen.findByTestId("delete-button"));

        if (accepted) {
            await waitFor(() => {
                expect(usePostServicesMock.deletePost).toHaveBeenCalledWith(post._id);
            });

            expect(navigateToMock).toHaveBeenCalledWith('/catalog');

        } else {
            await waitFor(() => {
                expect(usePostServicesMock.deletePost).not.toHaveBeenCalled();
            });

            expect(navigateToMock).not.toHaveBeenCalled();
        }
    });

    it("shows error message on a rejected post deletion call", async () => {
        setup({
            getPostWithCommentsSuccess: true,
            deletePostSuccess: false,
            editPostSuccess: true,
            editPostEmptyReturnValue: false,
            likePostSuccess: true,
            unlikePostSuccess: true,
        });

        vi.spyOn(window, "confirm").mockReturnValue(true);

        fireEvent.click(await screen.findByTestId("delete-button"));

        await waitFor(() => {
            expect(setAlert).toHaveBeenCalledWith(ERR_MSG.DELETE);
        });
    });

    it("successfully likes a post", async () => {
        setup();

        fireEvent.click(await screen.findByTestId("like-button"));

        await waitFor(() => {
            expect(usePostServicesMock.likePost).toHaveBeenCalledWith(isUser, post._id);
        });
    });

    it("shows error message on a rejected post like call", async () => {
        setup({
            getPostWithCommentsSuccess: true,
            deletePostSuccess: true,
            editPostSuccess: true,
            editPostEmptyReturnValue: false,
            likePostSuccess: false,
            unlikePostSuccess: true,
        });

        fireEvent.click(await screen.findByTestId("like-button"));

        await waitFor(() => {
            expect(usePostServicesMock.likePost).toHaveBeenCalledWith(isUser, post._id);
        });

        expect(setAlert).toHaveBeenCalledWith(ERR_MSG.LIKE);
    });

    it("successfully unlikes a post", async () => {
        setup();

        fireEvent.click(await screen.findByTestId("unlike-button"));

        await waitFor(() => {
            expect(usePostServicesMock.unlikePost).toHaveBeenCalledWith(isUser, post._id);
            expect(setAlert).not.toHaveBeenCalled();
        });
    });

    it("shows error message on a rejected post unlike call", async () => {
        setup({
            getPostWithCommentsSuccess: true,
            deletePostSuccess: true,
            editPostSuccess: true,
            editPostEmptyReturnValue: false,
            likePostSuccess: true,
            unlikePostSuccess: false,
        });

        fireEvent.click(await screen.findByTestId("unlike-button"));

        await waitFor(() => {
            expect(usePostServicesMock.unlikePost).toHaveBeenCalledWith(isUser, post._id);
        });

        expect(setAlert).toHaveBeenCalledWith(ERR_MSG.UNLIKE);
    });

    it("on edit button click renders post edit textarea with cancel and save buttons instead of post text", async () => {
        setup();

        expect(await screen.findByTestId("post-text")).toBeInTheDocument();
        expect(screen.queryByTestId("post-text-edit")).not.toBeInTheDocument();

        fireEvent.click(screen.getByTestId("edit-button"));

        expect(await screen.findByTestId("save-button")).toBeInTheDocument();
        expect(await screen.findByTestId("cancel-button")).toBeInTheDocument();

        expect(screen.queryByTestId("post-text")).not.toBeInTheDocument();
        expect(screen.getByTestId("post-text-edit")).toBeInTheDocument();
    });

    it("post text gets updated on user typing", async () => {
        setup();

        fireEvent.click(await screen.findByTestId("edit-button"));
        expect(screen.getByTestId("post-text-edit")).toHaveValue(post.text);

        fireEvent.change(screen.getByTestId("post-text-edit"), { target: { value: UPDATED_POST_CONTENT } });
        expect(screen.getByTestId("post-text-edit")).toHaveValue(UPDATED_POST_CONTENT);
    });

    it("on cancel button click rerenders to post text with correct content", async () => {
        setup();

        fireEvent.click(await screen.findByTestId("edit-button"));
        fireEvent.change(screen.getByTestId("post-text-edit"), { target: { value: UPDATED_POST_CONTENT } });

        fireEvent.click(screen.getByTestId("cancel-button"));

        expect(screen.getByTestId("post-text")).toHaveTextContent(post.text);
        expect(screen.queryByTestId("post-text-edit")).not.toBeInTheDocument();
    });

    it("on save button click renders default the post text with the updated content", async () => {
        setup();

        fireEvent.click(await screen.findByTestId("edit-button"));
        fireEvent.change(screen.getByTestId("post-text-edit"), { target: { value: UPDATED_POST_CONTENT } });
        expect(screen.getByTestId("post-text-edit")).toHaveValue(UPDATED_POST_CONTENT);

        fireEvent.click(screen.getByTestId("save-button"));

        await waitFor(() => {
            expect(usePostServicesMock.editPost).toHaveBeenCalledWith(post._id, UPDATED_POST_CONTENT);
        });

        expect(screen.queryByTestId("post-text-edit")).not.toBeInTheDocument();
    });

    it("does nothing when the save post call returns an empty value", async () => {
        setup({
            getPostWithCommentsSuccess: true,
            deletePostSuccess: true,
            editPostSuccess: true,
            editPostEmptyReturnValue: true,
            likePostSuccess: true,
            unlikePostSuccess: true,
        });

        fireEvent.click(await screen.findByTestId("edit-button"));
        fireEvent.change(screen.getByTestId("post-text-edit"), { target: { value: UPDATED_POST_CONTENT } });
        expect(screen.getByTestId("post-text-edit")).toHaveValue(UPDATED_POST_CONTENT);

        fireEvent.click(screen.getByTestId("save-button"));

        await waitFor(() => {
            expect(usePostServicesMock.editPost).toHaveBeenCalledWith(post._id, UPDATED_POST_CONTENT);
        });

        expect(screen.getByTestId("post-text-edit")).toBeInTheDocument();
    });

    it("shows error message on a rejected post save call", async () => {
        setup({
            getPostWithCommentsSuccess: true,
            deletePostSuccess: true,
            editPostSuccess: false,
            editPostEmptyReturnValue: false,
            likePostSuccess: true,
            unlikePostSuccess: true,
        });

        fireEvent.click(await screen.findByTestId("edit-button"));
        fireEvent.change(screen.getByTestId("post-text-edit"), { target: { value: UPDATED_POST_CONTENT } });
        expect(screen.getByTestId("post-text-edit")).toHaveValue(UPDATED_POST_CONTENT);

        fireEvent.click(screen.getByTestId("save-button"));

        await waitFor(() => {
            expect(usePostServicesMock.editPost).toHaveBeenCalledWith(post._id, UPDATED_POST_CONTENT);
        });

        expect(setAlert).toHaveBeenCalledWith(ERR_MSG.EDIT);
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