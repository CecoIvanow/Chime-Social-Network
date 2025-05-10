import { useContext } from "react"

import { ActionsContext } from "../../../../../../../contexts/actions-context";

export default function CommentText() {
    const { commentText } = useContext(ActionsContext);

    return <div className='post-text'>{commentText}</div>
}