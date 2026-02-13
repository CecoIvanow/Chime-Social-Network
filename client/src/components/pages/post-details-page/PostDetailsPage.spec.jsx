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
    default: () => {
        const postCtx = PostCtxConsumer();

        return (
            postCtx && (
                <div data-testid="post-header">{post.owner.firstName}</div>
            )
        );
    }
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
        deletePost: deletePostMock,
        editPost: editPostMock,
        getPostWithComments: getPostWithCommentsMock,
        likePost: likePostMock,
        unlikePost: unlikePostMock,
        abortAll: abortAllMock,
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
        firstName: "Ivan",
        _id: "ownerId123",
    },
};


const ActionsCtxConsumer = () => {
    const actions = useContext(ActionsContext);

    return actions;
}

const PostCtxConsumer = () => {
    const postCtx = useContext(PostContext);

    return postCtx;
};


const deletePostMock = vi.fn();
const editPostMock = vi.fn();
const getPostWithCommentsMock = vi.fn();
const likePostMock = vi.fn();
const unlikePostMock = vi.fn();
const abortAllMock = vi.fn();

const navigateToMock = vi.fn();

const setAlert = vi.fn();

function setup(options = {
    getPostWithCommentsSuccess: true,
    deletePostSuccess: true,
    editPostSuccess: true,
    editPostEmptyReturnValue: false,
    likePostSuccess: true,
    unlikePostSuccess: true,
}) {
    if (!options.editPostSuccess) {
        editPostMock.mockRejectedValue(new Error(ERR_MSG.EDIT));
    } else if (options.editPostEmptyReturnValue) {
        editPostMock.mockResolvedValue(undefined);
    } else {
        editPostMock.mockResolvedValue(UPDATED_POST_CONTENT);
    };

    options.deletePostSuccess ?
        deletePostMock.mockResolvedValue() :
        deletePostMock.mockRejectedValue(new Error(ERR_MSG.DELETE));

    options.likePostSuccess ?
        likePostMock.mockResolvedValue() :
        likePostMock.mockRejectedValue(new Error(ERR_MSG.LIKE));

    options.unlikePostSuccess ?
        unlikePostMock.mockResolvedValue() :
        unlikePostMock.mockRejectedValue(new Error(ERR_MSG.UNLIKE));

    options.getPostWithCommentsSuccess ?
        getPostWithCommentsMock.mockResolvedValue(post) :
        getPostWithCommentsMock.mockRejectedValue(new Error(ERR_MSG.GET_POST));

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
    it("renders components with passed props on successfull getPostWithComments call", async () => {
        setup();

        await waitFor(() => {
            expect(screen.getByTestId("comments-section")).toBeInTheDocument();
            expect(screen.getByTestId("post-header")).toHaveTextContent(post.owner.firstName);
            expect(screen.getByTestId("post-text")).toHaveTextContent(post.text);
            expect(screen.getByTestId("post-interactions")).toBeInTheDocument();
        });
    });

    it("does not render components on rejected getPostWithComments call", async () => {
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

    it("triggers abortAll on unmount", () => {
        const unmount = setup();

        unmount();

        expect(abortAllMock).toHaveBeenCalled();
    });

    it("triggers setAlert on rejected getPostWithComments call", async () => {
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
        { action: "triggers", confirm: "accepted", accepted: true },
        { action: "does not trigger", confirm: "cancelled", accepted: false },
    ])("triggers $action on $confirmState deletePost call", async ({ accepted }) => {
        setup();

        vi.spyOn(window, "confirm").mockReturnValue(accepted);

        fireEvent.click(await screen.findByTestId("delete-button"));

        if (accepted) {
            await waitFor(() => {
                expect(deletePostMock).toHaveBeenCalledWith(post._id);
            });

            expect(navigateToMock).toHaveBeenCalledWith('/catalog');

        } else {
            await waitFor(() => {
                expect(deletePostMock).not.toHaveBeenCalled();
            });

            expect(navigateToMock).not.toHaveBeenCalled();
        }
    });

    it("triggers setAlert on rejected deletePost call", async () => {
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

    it("calls likePost with currenrUser and post id", async () => {
        setup();

        fireEvent.click(await screen.findByTestId("like-button"));

        await waitFor(() => {
            expect(likePostMock).toHaveBeenCalledWith(isUser, post._id);
            expect(setAlert).not.toHaveBeenCalled();
        });
    });

    it("triggers setAlert on rejected likePost call", async () => {
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
            expect(likePostMock).toHaveBeenCalledWith(isUser, post._id);
        });

        expect(setAlert).toHaveBeenCalledWith(ERR_MSG.LIKE);
    });

    it("calls unlikePost with currenrUser and post id", async () => {
        setup();

        fireEvent.click(await screen.findByTestId("unlike-button"));

        await waitFor(() => {
            expect(unlikePostMock).toHaveBeenCalledWith(isUser, post._id);
            expect(setAlert).not.toHaveBeenCalled();
        });
    });

    it("triggers setAlert on rejected unlikePost call", async () => {
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
            expect(unlikePostMock).toHaveBeenCalledWith(isUser, post._id);
        });

        expect(setAlert).toHaveBeenCalledWith(ERR_MSG.UNLIKE);
    });

    it("triggers onEditPostClickHandler and sets isEditClicked to true", async () => {
        setup();

        expect(await screen.findByTestId("post-text")).toBeInTheDocument();
        expect(screen.queryByTestId("post-text-edit")).not.toBeInTheDocument();

        fireEvent.click(screen.getByTestId("edit-button"));

        expect(await screen.findByTestId("save-button")).toBeInTheDocument();
        expect(await screen.findByTestId("cancel-button")).toBeInTheDocument();

        expect(screen.queryByTestId("post-text")).not.toBeInTheDocument();
        expect(screen.getByTestId("post-text-edit")).toBeInTheDocument();
    });

    it("textChangeHandler updates post text content on trigger", async () => {
        setup();

        fireEvent.click(await screen.findByTestId("edit-button"));
        expect(screen.getByTestId("post-text-edit")).toHaveValue(post.text);

        fireEvent.change(screen.getByTestId("post-text-edit"), { target: { value: UPDATED_POST_CONTENT } });
        expect(screen.getByTestId("post-text-edit")).toHaveValue(UPDATED_POST_CONTENT);
    });

    it("onCancelEditHandler sets isEditClicked to false and postEditContent to default post text", async () => {
        setup();

        fireEvent.click(await screen.findByTestId("edit-button"));
        fireEvent.change(screen.getByTestId("post-text-edit"), { target: { value: UPDATED_POST_CONTENT } });

        fireEvent.click(screen.getByTestId("cancel-button"));

        expect(screen.getByTestId("post-text")).toHaveTextContent(post.text);
        expect(screen.queryByTestId("post-text-edit")).not.toBeInTheDocument();
    });

    it("calls editPost and sets isEditClicked false on successfull call", async () => {
        setup();

        fireEvent.click(await screen.findByTestId("edit-button"));
        fireEvent.change(screen.getByTestId("post-text-edit"), { target: { value: UPDATED_POST_CONTENT } });
        expect(screen.getByTestId("post-text-edit")).toHaveValue(UPDATED_POST_CONTENT);

        fireEvent.click(screen.getByTestId("save-button"));

        await waitFor(() => {
            expect(editPostMock).toHaveBeenCalledWith(post._id, UPDATED_POST_CONTENT);
        });

        expect(screen.queryByTestId("post-text-edit")).not.toBeInTheDocument();
    });

    it("calls editPost and does not set isEditClicked to false on empty return", async () => {
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
            expect(editPostMock).toHaveBeenCalledWith(post._id, UPDATED_POST_CONTENT);
        });

        expect(screen.getByTestId("post-text-edit")).toBeInTheDocument();
    });

    it("triggers setAlert on rejected editPost call", async () => {
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
            expect(editPostMock).toHaveBeenCalledWith(post._id, UPDATED_POST_CONTENT);
        });

        expect(setAlert).toHaveBeenCalledWith(ERR_MSG.EDIT);
    });

    it("triggers navigateTo on isEditClicked true and differing isUser and post owner id", async () => {

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

    it("does not trigger navigateTo on isEditClicked false", async () => {

        setup();

        await waitFor(() => {
            expect(navigateToMock).not.toHaveBeenCalled();
        })
    });

    it("does not trigger navigateTo on isEditClicked true and matching isUser and post owner id", async () => {
        post = {
            _id: POST_ID,
            text: "This is a post!",
            owner: {
                firstName: "Ivan",
                _id: isUser,
            },
        };

        setup();

        await waitFor(() => {
            expect(navigateToMock).not.toHaveBeenCalled();
        })
    });
});