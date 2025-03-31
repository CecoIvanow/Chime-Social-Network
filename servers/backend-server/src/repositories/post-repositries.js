import Post from "../models/Post.js";
import User from "../models/User.js";

import { postedOnDateConverter } from "../utils/date-time-utils.js";

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

    if (!postData) {
        throw new Error(`Post with ID ${postId} not found.`);
    }

    postData.postedOn = postedOnDateConverter(postData.createdAt);
    postData.comments.map(comment => comment.postedOn = postedOnDateConverter(comment.createdAt));

    return postData;
}

// async function getSpecific(postId) {
//     const postData = await Post
//         .findById(postId)
//         .select('-likes -comments -createdAt')
//         .populate({
//             path: 'owner',
//             select: COMMONLY_NEEDED_PARAMS
//         })
//         .lean();

//     if (!postData) {
//         throw new Error(`Post with ID ${ postId } not found.`);
//     }

//     return postData;
// }

async function create(postData) {
    // The line below offsets the time with 2+ hours as new Date() is 2 hours behind;
    const creationTime = new Date(Date.now() - new Date().getTimezoneOffset() * 60000);

    const owner = await User
        .findById(postData.owner)
        .select('_id')
        .lean();

    if (!owner) {
        throw new Error("Could not create: Creator id is invalid or missing, please login again.");
    }

    if (!postData.text) {
        return;
    }

    postData.createdAt = creationTime;
    postData.postedOn = postedOnDateConverter(creationTime);

    const newPost = await Post.create(postData);

    await newPost.populate({
        path: 'owner',
        select: COMMONLY_NEEDED_PARAMS,
    });

    return newPost;
}

async function getAll() {
    const matchedPosts = await Post
        .find({})
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

    if (!removedPost) {
        throw new Error(`Post with ID ${postId} not found or already deleted.`);
    }

    return removedPost.owner;
}

async function addLike(postId, userId) {
    const [user, foundPost] = await Promise.all([
        User.findById(userId).select('_id').lean(),
        Post.findById(postId).select('likes'),
    ])

    if (!foundPost) {
        throw new Error(`Post with ID ${postId} not found.`);
    }

    if (!user) {
        throw new Error("We couldn't locate your account. Please log in again.");
    }

    if (foundPost.likes.includes(userId)) {
        throw new Error(`Post with ID ${postId} already liked.`);
    }

    foundPost.likes.push(userId);

    await foundPost.save({ validateBeforeSave: false });
}

async function removeLike(postId, userId) {
    const [user, foundPost] = await Promise.all([
        User.findById(userId).select('_id').lean(),
        Post.findById(postId).select('likes'),
    ])

    if (!foundPost) {
        throw new Error(`Post with ID ${postId} not found.`);
    }

    if (!user) {
        throw new Error("We couldn't locate your account. Please log in again.");
    }

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

async function update(postId, payload) {
    const updatedPost = await Post.findByIdAndUpdate(postId, payload);

    if (!updatedPost) {
        throw new Error(`Post with ID ${postId} not found.`);
    }

    return updatedPost.text;
}

const postRepositories = {
    getSpecificWithComments,
    attachCommentToPost,
    removeComment,
    // getSpecific,
    removeLike,
    addLike,
    create,
    remove,
    update,
    getAll,
}

export default postRepositories;