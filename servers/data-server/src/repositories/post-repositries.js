import Post from "../models/Post.js";
import { postedOnDateConverter } from "../utils/date-time-utils.js";
import { escapeRegex } from "../utils/regex-utils.js";

const COMMONLY_NEEDED_PARAMS = 'firstName lastName imageUrl'

async function getSpecific(postId) {
    const postData = await Post
    .findById(postId)
    .populate({
        path: 'owner', 
        select: COMMONLY_NEEDED_PARAMS
    })
    .lean();

    postData.postedOn = postedOnDateConverter(postData.createdAt);

    return postData;
}

async function create(postData) {
    const newPost = await Post.create(postData);

    newPost.postedOn = postedOnDateConverter(newPost.createdAt);

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

const postRepositories = {
    getAllWithMatchingText,
    attachCommentToPost,
    getSpecific,
    removeLike,
    addLike,
    create,
    remove,
}

export default postRepositories;