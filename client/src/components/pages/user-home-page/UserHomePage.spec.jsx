import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import useUserServices from "../../../hooks/useUserServices";

import { AlertContext } from "../../../contexts/alert-context";
import { UserContext } from "../../../contexts/user-context";
import { TotalPostsContext } from "../../../contexts/total-posts-context";

import UserHomePage from "./UserHomePage";

vi.mock("../../../hooks/useUserServices");

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
    default: ({ userName, isLoading }) => <>
        <TotalPostsContext.Consumer>
            {TotalPostsContextValues => (
                isLoading ? (
                    <div data-testid="posts-loading-spinner" > Loading...</div>
                ) : (
                    <>
                        <div data-testid="posts-section">
                            {userName}
                            {TotalPostsContextValues?.totalPosts?.map(post => <div data-testid="post" key={post._id}>{post.content}</div>)}
                        </div>
                    </>
                )
            )}
        </TotalPostsContext.Consumer>
    </>
}));

vi.mock("./friends-section/FriendsSection", () => ({
    default: ({ userFriends, isLoading }) => <>
        {isLoading ? (
            <div data-testid="friends-loading-spinner">Loading...</div>
        ) : (
            userFriends.map(friend => <div data-testid="friends-section" key={friend._id} >{friend.name}</div>)
        )}
    </>
}));

describe("UserHomePage component", () => {
    const isUser = "userId";
    const setAlert = vi.fn();

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

    function renderComp(isLoading, getFullUserProfileMock = false) {
        const abortAll = vi.fn();

        useUserServices.mockReturnValue({
            abortAll,
            getFullUserProfile: getFullUserProfileMock ? vi.fn().mockRejectedValue(new Error("test reject getFullUserProfile")) : vi.fn().mockResolvedValue(userData),
            isLoading,
        });

        const { unmount } = render(
            <AlertContext.Provider value={{ setAlert }}>
                <UserContext.Provider value={{ isUser }}>
                    <UserHomePage />
                </UserContext.Provider>
            </AlertContext.Provider>
        );

        return { unmount, abortAll };
    }

    it.each([
        { isLoading: true, renderedComp: "isLoading" },
        { isLoading: false, renderedComp: "FriendsSection" },
    ])("passes props and on isLoading $isLoading renders $renderedComp", async ({ isLoading }) => {
        renderComp(isLoading);

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

        renderComp(isLoading);

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
        renderComp(isLoading);

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
        const isLoading = false;

        renderComp(isLoading, true);


        await waitFor(() => {
            expect(setAlert).toHaveBeenCalledOnce();
        });
    });

    it("triggers abortAll on unmount", () => {
        const isLoading = false;

        const { unmount, abortAll } = renderComp(isLoading);

        unmount();

        expect(abortAll).toHaveBeenCalledOnce();
    });
});