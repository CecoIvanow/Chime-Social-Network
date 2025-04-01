import api from '../utils/api.js';

async function handlePostCreate(postData, options = {}) {

    if (!postData.text) {
        return;
    }

    const resp = await api.post('/posts', postData)

    if (resp?.error) {
        throw new Error(resp.error);
    } else if (resp?.data) {
        return resp.data;
    }

    return resp.data;
}

async function handleGetAll(options = {}) {
    const resp = await api.get(`/posts`, { signal: options.abortSignal });

    if (resp.error) {
        throw new Error(resp.error);
    }

    resp.data.reverse();

    return resp.data;
}

async function handleDelete(postId, options = {}) {
    const resp = await api.delete(`/posts/${postId}`);

    if (resp.error) {
        throw new Error(resp.error);
    }

    return resp.data;
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

    resp.data.comments.reverse();

    return resp.data;
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

    return resp.data;
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