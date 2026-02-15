import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AlertContext } from "../../../contexts/alert-context";
import { TotalPostsContext } from "../../../contexts/total-posts-context";

import useUserServices from "../../../hooks/useUserServices";

import ProfilePage from "./ProfilePage";

vi.mock("../../../hooks/useUserServices");

vi.mock("../../shared/profile/profile-section/ProfileSection", () => ({
    default: ({ isLoading, userData }) => <>
        {isLoading ? (
            <div data-testid="profile-loading-spinner"></div>
        ) : (
            <div data-testid="profile-section">{userData.firstName}</div>
        )};
    </>
}));

vi.mock("../../shared/post/posts-section/PostsSection", () => ({
    default: ({ isLoading, userName }) => <>
        <TotalPostsContext.Consumer>
            {context => (
                isLoading ? (
                    <div data-testid="posts-loading-spinner" ></div>
                ) : (
                    <>
                        <div data-testid="posts-section">{userName}</div>
                            {context.totalPosts.map(post =>
                            <div key={post._id} data-testid="post"></div>)}
                    </>
                )
            )}
        </TotalPostsContext.Consumer>
    </>
}));

describe("ProfilePage component", () => {
    const abortAll = vi.fn();
    const setAlert = vi.fn();
    const getUserData = vi.fn();
    const getUserPosts = vi.fn();

    const userData = { firstName: "Petar" };
    const userPosts = {
        createdPosts: [
            { _id: 2},
            { _id: 1},
        ]
    }

    function renderComp(
        options = {
            isLoading: true,
            getUserData: true,
            getUserPosts: true,
        }
    ) {
        const getUserDataMock = options.getUserData ?
            getUserData.mockResolvedValue(userData) :
            getUserData.mockRejectedValue(new Error("Successfully rejected getUserData!"));

        const getUserPostsMock = options.getUserPosts ?
            getUserPosts.mockResolvedValue(userPosts) :
            getUserPosts.mockRejectedValue(new Error("Successfully rejected getUserPosts!"));

        useUserServices.mockReturnValue({
            isLoading: options.isLoading,
            getUserData: getUserDataMock,
            getUserPosts: getUserPostsMock,
            abortAll,
        });

        const { unmount } = render(
            <AlertContext.Provider value={{ setAlert }}>
                <ProfilePage />
            </AlertContext.Provider>
        );

        return unmount;
    }

    it.each([
        { isLoading: false, renderedComp: "ProfileSection" },
        { isLoading: true, renderedComp: "isLoading" },
    ])("passes props and on isLoading $isLoading renders $renderedComp", async ({ isLoading }) => {
        const pattern = new RegExp(`^${userData.firstName}$`)

        renderComp({
            isLoading,
            getUserData: true,
            getUserPosts: true,
        });

        if (isLoading) {
            expect(screen.queryByTestId("profile-section")).not.toBeInTheDocument();
            expect(screen.getByTestId("profile-loading-spinner")).toBeInTheDocument();
        } else {
            await waitFor(() => {
                expect(screen.getByTestId("profile-section")).toHaveTextContent(pattern);
            })
            expect(screen.queryByTestId("profile-loading-spinner")).not.toBeInTheDocument();
        };
    });

    it.each([
        { isLoading: false, renderedComp: "PostsSection" },
        { isLoading: true, renderedComp: "isLoading" },
    ])("passes props and on isLoading $isLoading renders $renderedComp", async ({ isLoading }) => {
        const pattern = new RegExp(`^${userData.firstName}$`)

        renderComp({
            isLoading,
            getUserData: true,
            getUserPosts: true,
        });

        if (isLoading) {
            expect(screen.queryByTestId("posts-section")).not.toBeInTheDocument();
            expect(screen.getByTestId("posts-loading-spinner")).toBeInTheDocument();
        } else {
            await waitFor(() => {
                expect(screen.getByTestId("posts-section")).toHaveTextContent(pattern);
                expect(screen.getAllByTestId("post")).toHaveLength(userPosts.createdPosts.length);
            });
            expect(screen.queryByTestId("posts-loading-spinner")).not.toBeInTheDocument();
        };
    });

    it.each([
        { getUserData: false, renderedComp: "ProfileSection" },
        { getUserPosts: false, renderedComp: "ProfileSection" },
    ])("triggers setAlert on rejected $renderedComp", async ({ getUserData, getUserPosts }) => {
        renderComp({
            isLoading: false,
            getUserData,
            getUserPosts,
        });

        await waitFor(() => {
            expect(setAlert).toHaveBeenCalled();
        })
    });

    it("triggers abortAll on unmount", () => {
        const unmount = renderComp();

        unmount();

        expect(abortAll).toHaveBeenCalled();
    });
});