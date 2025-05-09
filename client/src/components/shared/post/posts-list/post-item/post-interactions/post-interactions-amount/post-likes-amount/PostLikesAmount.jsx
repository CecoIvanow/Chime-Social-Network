import { useContext } from "react"
import { LikesContext } from "../../../../../../../../contexts/likes-context"

export default function PostLikesAmount() {
    const { likes } = useContext(LikesContext);

    return <>
        <div className="likes">Likes: {likes.length}</div>
    </>
}