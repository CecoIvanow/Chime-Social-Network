import { useContext } from "react";

import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AlertContext } from "../../../contexts/alert-context";
import { UserContext } from "../../../contexts/user-context";
import { TotalPostsContext } from "../../../contexts/total-posts-context";

import UserHomePage from "./UserHomePage";

vi.mock("../../../hooks/useUserServices", () => ({
    default: () => ({
        ...userUserServicesMock
    })
}));

vi.mock("../../shared/profile/profile-section/ProfileSection", () => ({
    default: ({ userData, isLoading }) => <>
        {isLoading ? (
            <div data-testid="profile-loading-spinner">Loading...</div>
        ) : (
            <div data-testid="profile-section">{userData.firstName}</div>
        )}
    </>
}));

vi.mock("../../shared/post/posts-section/PostsSection", () => ({
    default: function PostsSection({ userName, isLoading }) {
        const ctx = useContext(TotalPostsContext);

        return <>
            {isLoading ? (
                <div data-testid="posts-loading-spinner" > Loading...</div>
            ) : (
                <div data-testid="posts-section">
                    {userName}
                    {ctx.totalPosts.map(post =>
                        <div
                            data-testid="post"
                            key={post._id}
                        >
                            {post.content}
                        </div>
                    )}
                </div>
            )}
        </>
    }
}));

vi.mock("./friends-section/FriendsSection", () => ({
    default: ({ userFriends, isLoading }) => <>
        {isLoading ? (
            <div data-testid="friends-loading-spinner">Loading...</div>
        ) : (
            userFriends.map(friend =>
                <div
                    data-testid="friends-section"
                    key={friend._id}
                >
                    {friend.name}
                </div>)
        )}
    </>
}));

const ERR_MSG = {
    GET_FULL_USER_PROFILE: "test reject getFullUserProfile",
}

const isUser = "userId";

const userData = {
    firstName: "Tsetso",
    friends: [
        {
            _id: 1,
            name: "Thomas",
            createdPosts: [
                { _id: 11, content: "Thomas` first post" },
                { _id: 12, content: "Thomas` second post" },
            ]
        },
        {
            _id: 2,
            name: "Ivan",
            createdPosts: [
                { _id: 21, content: "Ivan`s first post" },
                { _id: 22, content: "Ivan`s second post" },
            ]
        },
    ],
    createdPosts: [
        { _id: "userPost1", content: "Tsetso's first post" },
        { _id: "userPost2", content: "Tsetso's second post" }
    ]
};

const userUserServicesMock = {
    getFullUserProfile: vi.fn(),
    abortAll: vi.fn(),
    isLoading: false,
}

const setAlert = vi.fn();

function setup(options = {
    isLoading: false,
    getFullUserProfileSuccess: true,
}) {
    options.getFullUserProfileSuccess ?
        userUserServicesMock.getFullUserProfile.mockResolvedValue(userData) :
        userUserServicesMock.getFullUserProfile.mockRejectedValue(new Error(ERR_MSG.GET_FULL_USER_PROFILE));

    userUserServicesMock.isLoading = options.isLoading;

    return render(
        <AlertContext.Provider value={{ setAlert }}>
            <UserContext.Provider value={{ isUser }}>
                <UserHomePage />
            </UserContext.Provider>
        </AlertContext.Provider>
    );
};

describe("UserHomePage component", () => {
    it.each([
        { isLoading: true, renderedComp: "isLoading" },
        { isLoading: false, renderedComp: "FriendsSection" },
    ])("passes props and on isLoading $isLoading renders $renderedComp", async ({ isLoading }) => {
        setup({
            getFullUserProfileSuccess: true,
            isLoading,
        });

        if (isLoading) {
            expect(await screen.findByTestId("friends-loading-spinner")).toBeInTheDocument();
            expect(screen.queryAllByTestId("friends-section")).toHaveLength(0);
        } else {
            expect(await screen.findAllByTestId("friends-section")).toHaveLength(userData.friends.length);
            expect(screen.queryByTestId("friends-loading-spinner")).not.toBeInTheDocument();

            userData.friends.forEach(friend => {
                expect(screen.getByText(friend.name)).toBeInTheDocument();
            });
        };
    });

    it.each([
        { isLoading: true, renderedComp: "isLoading" },
        { isLoading: false, renderedComp: "ProfileSection" },
    ])("passes props and on isLoading $isLoading renders $renderedComp", async ({ isLoading }) => {
        const namePattern = new RegExp(`^${userData.firstName}$`);

        setup({
            getFullUserProfileSuccess: true,
            isLoading,
        });

        if (isLoading) {
            expect(await screen.findByTestId("profile-loading-spinner")).toBeInTheDocument();
            expect(screen.queryByTestId("profile-section")).not.toBeInTheDocument();
        } else {
            expect(await screen.findByTestId("profile-section")).toHaveTextContent(namePattern);
            expect(screen.queryByTestId("profile-loading-spinner")).not.toBeInTheDocument();
        };
    });

    it.each([
        { isLoading: true, renderedComp: "isLoading" },
        { isLoading: false, renderedComp: "PostsSection" },
    ])("passes props and on isLoading $isLoading renders $renderedComp", async ({ isLoading }) => {
        setup({
            getFullUserProfileSuccess: true,
            isLoading,
        });

        if (isLoading) {
            expect(await screen.findByTestId("posts-loading-spinner")).toBeInTheDocument();
            expect(screen.queryByTestId("posts-section")).not.toBeInTheDocument();
        } else {
            let totalPostsAmount = userData.createdPosts.length;
            let allPosts = Array.from(userData.createdPosts);

            userData.friends.forEach(friend => totalPostsAmount += friend.createdPosts.length);
            userData.friends.forEach(friend => friend.createdPosts.forEach(post => allPosts.push(post)));

            expect(await screen.findAllByTestId("post")).toHaveLength(totalPostsAmount);
            expect(screen.queryByTestId("posts-loading-spinner")).not.toBeInTheDocument();

            allPosts.forEach(post => expect(screen.getByText(post.content)).toBeInTheDocument());
        };
    });

    it("triggers setAlert on rejected getFullPromise", async () => {
        setup({
            getFullUserProfileSuccess: false,
            isLoading: false,
        });


        await waitFor(() => {
            expect(setAlert).toHaveBeenCalledWith(ERR_MSG.GET_FULL_USER_PROFILE);
        });
    });

    it("triggers abortAll on unmount", () => {
        const { unmount } = setup();

        unmount();

        expect(userUserServicesMock.abortAll).toHaveBeenCalled();
    });
});