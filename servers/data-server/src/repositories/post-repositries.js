import Post from "../models/Post.js";
import { postedOnDateConverter } from "../utils/date-time-utils.js";
import { escapeRegex } from "../utils/regex-utils.js";

const COMMONLY_NEEDED_PARAMS = 'firstName lastName imageUrl'

async function getSpecificWithComments(postId) {
    const postData = await Post
    .findById(postId)
    .populate({
        path: 'owner', 
        select: COMMONLY_NEEDED_PARAMS
    })
    .populate({
        path: 'comments',
        select: 'text createdAt',
        populate: {
            path: 'owner',
            select: COMMONLY_NEEDED_PARAMS,
        },
    })
    .lean();

    postData.postedOn = postedOnDateConverter(postData.createdAt);
    postData.comments.map(comment => comment.postedOn = postedOnDateConverter(comment.createdAt));

    return postData;
}

async function create(postData) {
    // The line below offsets the time with 2+ hours as new Date() is 2 hours behind;
    const creationTime = new Date(Date.now() - new Date().getTimezoneOffset() * 60000);

    postData.createdAt = creationTime;
    postData.postedOn = postedOnDateConverter(creationTime);

    const newPost = await Post.create(postData);

    return newPost;
}

async function getAllWithMatchingText(filter) {
    const escapedFilter = escapeRegex(filter);

    const textRegex = new RegExp(escapedFilter, 'i');

    const matchedPosts = await Post
        .find({})
        .where({ text: textRegex })
        .populate({
            path: 'owner',
            select: COMMONLY_NEEDED_PARAMS
        })
        .lean();   

    matchedPosts.map(post => post.postedOn = postedOnDateConverter(post.createdAt));

    return matchedPosts;
}

async function remove(postId) {
    const removedPost = await Post.findByIdAndDelete(postId);

    return removedPost.owner;
}

async function addLike(postId, userId) {
    const foundPost = await Post.findById(postId);

    foundPost.likes.push(userId);

    await foundPost.save();
}

async function removeLike(postId, userId) {
    const foundPost = await Post.findById(postId);

    foundPost.likes = foundPost.likes.filter(likedUserId => likedUserId.toString() !== userId);

    await foundPost.save();
}

async function attachCommentToPost(postId, commentId) {
    const foundPost = await Post.findById(postId);

    foundPost.comments.push(commentId);

    await foundPost.save();
}

async function removeComment(postId, commentId) {
    const foundPost = await Post.findById(postId);

    foundPost.comments = foundPost.comments.filter(comment => comment.toString() !== commentId);

    await foundPost.save();
}

const postRepositories = {
    getSpecificWithComments,
    getAllWithMatchingText,
    attachCommentToPost,
    removeComment,
    removeLike,
    addLike,
    create,
    remove,
}

export default postRepositories;