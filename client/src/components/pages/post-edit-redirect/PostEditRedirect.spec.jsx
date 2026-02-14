import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import PostEditRedirect from "./PostEditRedirect";

vi.mock("react-router", () => ({
    useNavigate: () => useNavigateMock,
    useParams: () => useParamsMock(),
}));

const POST_ID = "randomUserId";
const REDIRECT_URL = `/post/${POST_ID}/details`;
const REDIRECT_OPTIONS = { state: { shouldEdit: true } };

const useNavigateMock = vi.fn();
const useParamsMock = () => ({ postId: POST_ID });

function setup() {
    render(
        <PostEditRedirect />
    )
}

describe("PostEditRedirect component", () => {
    it("redirects on render", () => {
        setup();

        expect(useNavigateMock).toHaveBeenCalledWith(REDIRECT_URL, REDIRECT_OPTIONS);
    });
});