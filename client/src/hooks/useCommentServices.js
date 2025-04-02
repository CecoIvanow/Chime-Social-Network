import { useCallback } from "react";
import useFetch from "./useFetch.js";

export default function useCommentServices() {
    const { fetchExecute, isLoading, isLoadingRef } = useFetch();

    const createComment = useCallback(async (payload) => {
        if (!isLoadingRef.current) {
            if (!payload.text) {
                return;
            }

            const data = await fetchExecute('/comments', 'POST', payload);

            return data;
        }
    }, [fetchExecute, isLoadingRef]);

    return {
        isLoading,
        createComment,
    }
}