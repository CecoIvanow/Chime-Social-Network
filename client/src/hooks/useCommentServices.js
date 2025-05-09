import { useCallback, useMemo } from "react";

import useFetch from "./useFetchApiCall.js";

export default function useCommentServices() {
    const { fetchExecute, isLoading, abortFetchRequest } = useFetch();

    const commentRequests = useMemo(() => [], []);

    const abortAll = useCallback(() => {
        for (const { method, url } of commentRequests) {
            abortFetchRequest(url, method);
        }
    }, [abortFetchRequest, commentRequests])

    const createComment = useCallback(async (payload) => {
        const trimmedText = payload.text.trim();
        if (!trimmedText) {
            return;
        }

        const url = `/comments`;
        const method = 'POST'
        commentRequests.push({ url, method, });

        return await fetchExecute(url, method, { ...payload, text: trimmedText });
    }, [fetchExecute, commentRequests]);

    const updateComment = useCallback(async (commentId, text) => {
        const trimmedText = text.trim();
        if (!trimmedText) {
            return;
        }

        const url = `/comments/${commentId}`;
        const method = 'PATCH'
        commentRequests.push({ url, method, });

        return await fetchExecute(url, method, { text: trimmedText });
    }, [fetchExecute, commentRequests]);

    const deleteComment = useCallback(async (commentId) => {
        const url = `/comments/${commentId}`;
        const method = 'DELETE'
        commentRequests.push({ url, method, });

        return await fetchExecute(url, method);
    }, [fetchExecute, commentRequests]);

    return {
        abortAll,
        createComment,
        updateComment,
        deleteComment,
        isLoading,
    }
}