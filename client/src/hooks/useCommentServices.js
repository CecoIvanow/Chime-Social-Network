import { useCallback } from "react";

import useFetch from "./useFetch.js";

export default function useCommentServices() {
    const { fetchExecute, isLoading, isLoadingRef } = useFetch();

    const createComment = useCallback(async (payload) => {
        if (isLoadingRef.current) {
            return;
        }

        const trimmedText = payload.text.trim();

        if (!trimmedText) {
            return;
        }

        const data = await fetchExecute('/comments', 'POST', {...payload, text: trimmedText});

        return data;
    }, [fetchExecute, isLoadingRef]);

    const updateComment = useCallback(async (commentId, text) => {
        if (isLoadingRef.current) {
            return;
        }

        const finalCommentText = text.trim();

        if (!finalCommentText) {
            return;
        }

        const data = await fetchExecute(`/comments/${commentId}`, 'PATCH', { text: finalCommentText });

        return data;
    }, [fetchExecute, isLoadingRef]);

    return {
        isLoading,
        createComment,
        updateComment,
    }
}