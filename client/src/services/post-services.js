import defaultAvatar from '../public/images/default-profile-avatar.png'

import postApi from "../api/post-api.js"
import { postedOnDateConverter } from "../utils/date-time-utils.js";

async function handleGetAllWithOwners(abortSignal) {
    const allPosts = await postApi.getAllWithOwners(abortSignal);

    allPosts
        .reverse()
        .map(post => {
            post.postedOn = postedOnDateConverter(post.createdAt)
            post.owner.imageUrl = post.owner.imageUrl ? post.owner.imageUrl : defaultAvatar;
        })

    return allPosts
}

async function handlePostCreate(postData) {
    const newPost = await postApi.createPost(postData);

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

const postServices = {
    handleGetAllByContentWithOwners,
    handleGetAllWithOwners,
    handlePostCreate,
}

export default postServices