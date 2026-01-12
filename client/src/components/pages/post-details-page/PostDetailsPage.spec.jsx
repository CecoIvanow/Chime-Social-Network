import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

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
    >
        {postText}
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
        {post => <ActionsContext.Consumer>
            {actions => <div data-testid="post-interactions">
                <button data-testid="like-button" onClick={actions.onLikeClickHandler}>Like</button>
                <button data-testid="unlike-button" onClick={actions.onUnlikeClickHandler}>Unlike</button>
                <button data-testid="edit-button" onClick={actions.onEditPostClickHandler}>Edit</button>
                <button data-testid="save-button" onClick={() => actions.onSaveEditClickHandler(post._id)}>Save</button>
                <button data-testid="cancel-button" onClick={actions.onCancelEditClickHandler}>Cancel</button>
                <button data-testid="delete-button" onClick={() => actions.onDeleteClickHandler(post._id)}>Delete</button>
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
    useNavigate: () => navigateToMock(),
}));

const POST_ID = "postId435";

const NEW_POST_CONTENT = "Updated Content!";

const isUser = "user123";

let ownerId = "ownerId123";

let shouldEdit = false;

const location = {
    state: {
        shouldEdit,
    },
    pathname:`/posts/${POST_ID}`,
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
        editPostMock.mockResolvedValue(NEW_POST_CONTENT);
    } else if (options.editPostEmptyReturnValue) {
        editPostMock.mockResolvedValue(undefined);
    } else {
        editPostMock.mockRejectedValue("Successfully rejected editPost call!")
    };

    if (!options.deletePostSuccess) {
        deletePostMock.mockRejectedValue(new Error("Successfully rejected deletePost call!"));
    };

    if (!options.likePostSuccess) {
        deletePostMock.mockRejectedValue(new Error("Successfully rejected likePost call!"));
    };

    if (!options.unlikePostSuccess) {
        deletePostMock.mockRejectedValue(new Error("Successfully rejected unlikePost call!"));
    };

    options.getPostWithCommentsSuccess ?
        getPostWithCommentsMock.mockResolvedValue(post) :
        getPostWithCommentsMock.mockRejectedValue(new Error("Successfully rejected getPostWithComments call!"));

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
});