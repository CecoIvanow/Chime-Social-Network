import { useCallback, useMemo } from "react";

import useFetch from "./useFetchApiCall.js";

export default function usePostServices() {
    const { fetchExecute, isLoading, abortFetchRequest } = useFetch();

    const postRequests = useMemo(() => [], []);

    const abortAll = useCallback(() => {
        for (const { method, url } of postRequests) {
            abortFetchRequest(url, method);
        }
    }, [abortFetchRequest, postRequests])

    const createPost = useCallback(async (payload) => {
        const trimmedText = payload.text.trim();
        if (!trimmedText) {
            return;
        }

        const url = `/posts`;
        const method = 'POST'
        postRequests.push({ url, method, });

        return await fetchExecute(url, method, { ...payload, text: trimmedText });
    }, [fetchExecute, postRequests]);

    const deletePost = useCallback(async (postId) => {
        const url = `/posts/${postId}`;
        const method = 'DELETE'
        postRequests.push({ url, method, });

        return await fetchExecute(url, method);
    }, [fetchExecute, postRequests]);

    const likePost = useCallback(async (userId, postId) => {
        const url = `/posts/${postId}/like/${userId}`;
        const method = 'POST'
        postRequests.push({ url, method, });

        return await fetchExecute(url, method);
    }, [fetchExecute, postRequests]);

    const unlikePost = useCallback(async (userId, postId) => {
        const url = `/posts/${postId}/like/${userId}`;
        const method = 'DELETE'
        postRequests.push({ url, method, });

        return await fetchExecute(url, method);
    }, [fetchExecute, postRequests]);

    const editPost = useCallback(async (postId, text) => {
        const trimmedText = text.trim();
        if (!trimmedText) {
            return;
        }

        const url = `/posts/${postId}`;
        const method = 'PATCH'
        postRequests.push({ url, method, });

        return await fetchExecute(url, method, { text: trimmedText });
    }, [fetchExecute, postRequests]);

    const getAllPosts = useCallback(async () => {
        const url = `/posts`;
        const method = 'GET'
        postRequests.push({ url, method, });

        const data = await fetchExecute(`/posts`);

        return data?.reverse();
    }, [fetchExecute, postRequests]);

    const getPostWithComments = useCallback(async (postId) => {
        const url = `/posts/${postId}/with-comments`;
        const method = 'GET'
        postRequests.push({ url, method, });

        const data = await fetchExecute(url);
        data?.comments.reverse();

        return data;
    }, [fetchExecute, postRequests]);

    return {
        isLoading,
        createPost,
        deletePost,
        likePost,
        unlikePost,
        editPost,
        getAllPosts,
        getPostWithComments,
        abortAll,
    }
}