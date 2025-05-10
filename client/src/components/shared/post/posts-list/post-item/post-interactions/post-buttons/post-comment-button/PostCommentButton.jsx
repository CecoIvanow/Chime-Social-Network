import { memo, useContext } from "react";

import LinkButton from "../../../../../../ui/buttons/link-button/LinkButton";

import { PostContext } from "../../../../../../../contexts/post-context";

function PostCommentButton() {
    const { post } = useContext(PostContext);

    return <>
        <LinkButton
            urlLink={`/post/${post._id}/details`}
            btnStyle="button comment-btn"
            buttonName="Comment"
        />
    </>
}

export default memo(PostCommentButton);