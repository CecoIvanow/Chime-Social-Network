import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import UserHomePage from "./UserHomePage";

import { AlertContext } from "../../../contexts/alert-context";
import { UserContext } from "../../../contexts/user-context";
import { TotalPostsContext } from "../../../contexts/total-posts-context";

import useUserServices from "../../../hooks/useUserServices";

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
                        <div data-testid="posts-section">{userName}</div>
                        {TotalPostsContextValues?.totalPosts?.map(post => <div data-testid="post" key={post._id}>{post.content}</div>)}
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

vi.mock("../../../hooks/useUserServices");

describe("UserHomePage component", () => {
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
            { _id: "userPost2", content: "Tsetso's first post" }
        ]
    }

    const abortAll = vi.fn();
    const setAlert = vi.fn();
    const getFullUserProfile = vi.fn();

    it.each([
        { isLoading: true, renderedComp: "isLoading" },
        { isLoading: false, renderedComp: "isLoading" },
    ])("on isLoading $isLoading renders $renderedComp and passes props", async ({ isLoading }) => {
        useUserServices.mockReturnValue({
            abortAll,
            getFullUserProfile: getFullUserProfile.mockResolvedValue(userData),
            isLoading,
        });

        render(
            <AlertContext.Provider value={{ setAlert }}>
                <UserContext.Provider value={{ isUser }}>
                    <UserHomePage />
                </UserContext.Provider>
            </AlertContext.Provider>
        );

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
});