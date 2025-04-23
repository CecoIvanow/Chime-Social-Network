import { useCallback } from "react";

import useFetch from "./useFetchApiCall.js";

export default function usePostServices() {
    const { fetchExecute, isLoading, isLoadingRef } = useFetch();

    const createPost = useCallback(async (payload) => {
        if (isLoadingRef.current) {
            return;
        }

        const trimmedText = payload.text.trim();

        if (!trimmedText) {
            return;
        }

        const data = await fetchExecute('/posts', 'POST', { ...payload, text: trimmedText });

        return data;
    }, [fetchExecute, isLoadingRef]);

    const deletePost = useCallback(async (postId) => {
        if (isLoadingRef.current) {
            return;
        }

        const data = await fetchExecute(`/posts/${postId}`, 'DELETE');

        return data;
    }, [fetchExecute, isLoadingRef]);

    const likePost = useCallback(async (userId, postId) => {
        if (isLoadingRef.current) {
            return;
        }

        await fetchExecute(`/posts/${postId}/like/${userId}`, 'POST');

    }, [fetchExecute, isLoadingRef]);

    const unlikePost = useCallback(async (userId, postId) => {
        if (isLoadingRef.current) {
            return;
        }

        await fetchExecute(`/posts/${postId}/like/${userId}`, 'DELETE');

    }, [fetchExecute, isLoadingRef]);

    const editPost = useCallback(async (postId, text) => {
        if (isLoadingRef.current) {
            return;
        }

        const trimmedText = text.trim();

        if (!trimmedText) {
            return;
        }

        const data = await fetchExecute(`/posts/${postId}`, 'PATCH', { text: trimmedText });

        return data;

    }, [fetchExecute, isLoadingRef]);

    const getAllPosts = useCallback(async () => {
        if (isLoadingRef.current) {
            return;
        }

        const data = await fetchExecute(`/posts`);

        return data?.reverse();
    }, [fetchExecute, isLoadingRef]);

    const getPostWithComments = useCallback(async (postId) => {
        if (isLoadingRef.current) {
            return;
        }

        const data = await fetchExecute(`/posts/${postId}/with-comments`);

        data.comments?.reverse();

        return data;
    }, [fetchExecute, isLoadingRef]);

    return {
        isLoading,
        createPost,
        deletePost,
        likePost,
        unlikePost,
        editPost,
        getAllPosts,
        getPostWithComments,
    }
}