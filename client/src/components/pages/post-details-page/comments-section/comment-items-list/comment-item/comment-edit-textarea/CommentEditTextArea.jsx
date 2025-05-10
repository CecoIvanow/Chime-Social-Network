import { useContext } from "react"

import { ActionsContext } from "../../../../../../../contexts/actions-context"

export default function CommentEditTextArea() {
    const { onEditCommentText, onTextChangeHandler } = useContext(ActionsContext);

    return <textarea className="edit-textarea"
        defaultValue={onEditCommentText}
        onChange={onTextChangeHandler}
        placeholder="Edit your post content..." />
}