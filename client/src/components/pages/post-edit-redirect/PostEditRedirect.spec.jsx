import { render } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import PostEditRedirect from "./PostEditRedirect";

vi.mock("react-router", () => ({
    useNavigate: () => reactRouterMock.useNavigate,
    useParams: () => reactRouterMock.useParams(),
}));

const POST_ID = "randomUserId";
const REDIRECT_URL = `/post/${POST_ID}/details`;
const REDIRECT_OPTIONS = { state: { shouldEdit: true } };

const reactRouterMock = {
    useNavigate: vi.fn(),
    useParams: () => ({ postId: POST_ID }),
}

beforeEach(() => {
    render(
        <PostEditRedirect />
    );
});

describe("PostEditRedirect component", () => {
    it("redirects to correct post url with correct state", () => {
        expect(reactRouterMock.useNavigate).toHaveBeenCalledWith(REDIRECT_URL, REDIRECT_OPTIONS);
    });
});