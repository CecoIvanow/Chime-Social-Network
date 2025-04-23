import { useCallback } from "react";

import useFetch from "./useFetchApiCall.js";

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

        const data = await fetchExecute('/comments', 'POST', { ...payload, text: trimmedText });

        return data;
    }, [fetchExecute, isLoadingRef]);

    const updateComment = useCallback(async (commentId, text) => {
        if (isLoadingRef.current) {
            return;
        }

        const trimmedText = text.trim();

        if (!trimmedText) {
            return;
        }

        const data = await fetchExecute(`/comments/${commentId}`, 'PATCH', { text: trimmedText });

        return data;
    }, [fetchExecute, isLoadingRef]);

    const deleteComment = useCallback(async (commentId) => {
        if (isLoadingRef.current) {
            return;
        }

        const data = await fetchExecute(`/comments/${commentId}`, 'DELETE');

        return data;
    }, [fetchExecute, isLoadingRef]);

    return {
        isLoading,
        createComment,
        updateComment,
        deleteComment,
    }
}