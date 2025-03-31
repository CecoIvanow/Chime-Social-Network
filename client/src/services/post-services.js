import api from '../utils/api.js';

async function handlePostCreate(postData, options = {}) {

    if (!postData.text) {
        return;
    }

    const resp = await api.post('/posts', postData)

    if (resp?.error) {
        throw new Error(resp.error);
    } else if (resp?.newPost) {
        return resp.newPost;
    }

    return resp.newPost;
}

async function handleGetAll(options = {}) {
    const resp = await api.get(`/posts`, { signal: options.abortSignal });

    if (resp.error) {
        throw new Error(resp.error);
    }

    resp.allPosts.reverse();

    return resp.allPosts;
}

async function handleDelete(postId, options = {}) {
    const resp = await api.delete(`/posts/${postId}`);

    if (resp.error) {
        throw new Error(resp.error);
    }

    return resp.removedPostId;
}

async function handleLike(userId, postId, options = {}) {
    const resp = await api.post(`/posts/${postId}/like/${userId}`);

    if (resp?.error) {
        throw new Error(resp.error);
    }
}

async function handleUnlike(userId, postId, options = {}) {
    const resp = await api.delete(`/posts/${postId}/like/${userId}`);

    if (resp?.error) {
        throw new Error(resp.error);
    }
}

async function handleGetPostDataWithComments(postId, options = {}) {
    const resp = await api.get(`/posts/${postId}/with-comments`, { signal: options.abortSignal });

    if (resp.error) {
        throw new Error(resp.error);
    }

    resp.postData.comments.reverse();

    return resp.postData;
}

// async function handleGetPostData(postId, abortSignal, options = {}) {
//     const postData = await api.get(`/posts/${postId}/with-comments`, { signal: abortSignal });

//     return postData;
// }

async function handlePostUpdate(postId, newText, options = {}) {
    const updatedText = newText.trim();

    if (!updatedText) {
        return;
    }

    const resp = await api.patch(`/posts/${postId}`, { text: updatedText });

    if (resp?.error) {
        throw new Error(resp.error);
    }

    return resp.postText;
}

const postServices = {
    handleGetPostDataWithComments,
    // handleGetPostData,
    handlePostCreate,
    handlePostUpdate,
    handleDelete,
    handleGetAll,
    handleUnlike,
    handleLike,
}

export default postServices