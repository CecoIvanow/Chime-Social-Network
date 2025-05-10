import { useContext, useEffect } from "react";

import { ActionsContext } from "../../../../../../contexts/actions-context";
import CommentItemHeader from "./comment-item-header/CommentItemHeader";
import CommentText from "./comment-text/CommentText";
import CommentEditTextArea from "./comment-edit-textarea/CommentEditTextArea";
import CommentButtons from "./comment-buttons/CommentButtons";

export default function CommentItem({
    comment,
}) {
    const {
        isEditClicked,
        setCommentText,
        setOnEditCommentText,
    } = useContext(ActionsContext);

    useEffect(() => {
        setCommentText(comment.text);
        setOnEditCommentText(comment.text);
    }, [comment.text, setCommentText, setOnEditCommentText])

    return <>
        <li className='comment-item'>
            <CommentItemHeader
                comment={comment}
            />

            {isEditClicked ? (
                <CommentEditTextArea />
            ) : (
                <CommentText />
            )}

            <CommentButtons
                comment={comment}
            />
        </li >
    </>
}