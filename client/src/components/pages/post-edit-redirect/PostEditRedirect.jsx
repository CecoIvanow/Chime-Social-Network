import { useEffect } from "react";
import { useNavigate, useParams } from "react-router"

export default function PostEditRedirect() {
    const navigateTo = useNavigate();
    const { postId } = useParams();

    useEffect(() => {
        navigateTo(`/post/${postId}/details`, { state: { shouldEdit: true } });
    }, [navigateTo, postId])

    return null;
}