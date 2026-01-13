import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import PostDetailsPage from "./PostDetailsPage";

import { PostContext } from "../../../contexts/post-context";
import { UserContext } from "../../../contexts/user-context";
import { AlertContext } from "../../../contexts/alert-context";
import { ActionsContext } from "../../../contexts/actions-context";

vi.mock("./comment-create-form/CommentCreateForm", () => ({
    default: () => <div data-testid="comment-create-form"></div>
}));

vi.mock("./comments-section/CommentsSection", () => ({
    default: () => <ul data-testid="comments-section">
        <li>
            <p>Comment 1</p>;
        </li>
        <li>
            <p>Comment 2</p>;
        </li>
    </ul>
}));

vi.mock("./post-edit-content/PostEditContent", () => ({
    default: ({ postText, textChangeHandler }) => <textarea
        data-testid="post-text-edit"
        onChange={(e) => textChangeHandler(e)}
        value={postText}
    >
    </textarea>
}));

vi.mock("../../shared/post/post-header/PostHeader", () => ({
    default: () => <PostContext.Consumer>
        {postContext =>
            postContext && (
                <h4 data-testid="post-header">{post.owner.firstName}</h4>
            )
        }
    </PostContext.Consumer>
}));

vi.mock("../../shared/post/post-interactions/PostInteractions", () => ({
    default: () => <PostContext.Consumer>
        {postContext => <ActionsContext.Consumer>
            {actionsContext => <div data-testid="post-interactions">
                <button data-testid="like-button" onClick={actionsContext.onLikeClickHandler}>Like</button>
                <button data-testid="unlike-button" onClick={actionsContext.onUnlikeClickHandler}>Unlike</button>
                <button data-testid="edit-button" onClick={actionsContext.onEditPostClickHandler}>Edit</button>
                <button data-testid="delete-button" onClick={() => actionsContext.onDeleteClickHandler(postContext.post._id)}>Delete</button>

                {actionsContext.isEditClicked && <>
                    <button data-testid="save-button" onClick={() => actionsContext.onSaveEditClickHandler(postContext.post._id)}>Save</button>
                    <button data-testid="cancel-button" onClick={actionsContext.onCancelEditClickHandler}>Cancel</button>
                </>}
            </div>}
        </ActionsContext.Consumer>}
    </PostContext.Consumer>
}));

vi.mock("../../shared/post/post-text/PostText", () => ({
    default: ({ postText }) => <p data-testid="post-text">{postText}</p>
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
    EDIT: "Successfully rejected editPost call!",
    DELETE: "Successfully rejected deletePost call!",
    LIKE: "Successfully rejected likePost call!",
    UNLIKE: "Successfully rejected unlikePost call!",
    GET_POST: "Successfully rejected getPostWithComments call!"
}

const POST_ID = "postId435";

const UPDATED_POST_CONTENT = "Updated Content!";

const isUser = "user123";

let ownerId = "ownerId123";

let shouldEdit = false;

const location = {
    state: {
        shouldEdit,
    },
    pathname: `/posts/${POST_ID}`,
};

const post = {
    _id: POST_ID,
    text: "This is a post!",
    owner: {
        firstName: "Ivan",
        _id: ownerId,
    },
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

    render(
        <AlertContext.Provider value={{ setAlert }}>
            <UserContext.Provider value={{ isUser }}>
                <PostDetailsPage />
            </UserContext.Provider>
        </AlertContext.Provider>
    );
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
});