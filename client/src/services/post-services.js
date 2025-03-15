import defaultAvatar from '/images/default-profile-avatar.png'

import postApi from "../api/post-api.js"
import { postedOnDateConverter } from "../utils/date-time-utils.js";

async function handlePostCreate(postData) {
    const newPost = await postApi.create(postData);

    newPost.postedOn = postedOnDateConverter(newPost.createdAt);

    return newPost;
}

async function handleGetAllByContentWithOwners(searchParam, abortSignal) {
    const matchedPosts = await postApi.retrieveByContent(searchParam, abortSignal);

    matchedPosts
        .reverse()
        .map(post => {
            post.postedOn = postedOnDateConverter(post.createdAt)
            post.owner.imageUrl = post.owner.imageUrl ? post.owner.imageUrl : defaultAvatar;
        })

    return matchedPosts;
}

async function handleDelete(postId) {
    const removedPostId =  await postApi.remove(postId);

    return removedPostId;
}

async function handleLike(userId, postId) {
    await postApi.addLike(userId, postId);
}

async function handleUnlike(userId, postId) {
    await postApi.removeLike(userId, postId);
}

const postServices = {
    handleGetAllByContentWithOwners,
    handlePostCreate,
    handleDelete,
    handleUnlike,
    handleLike
}

export default postServices