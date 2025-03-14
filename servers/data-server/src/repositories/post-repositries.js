import Post from "../models/Post.js";

const COMMONLY_NEEDED_PARAMS = 'firstName lastName imageUrl'

async function create(postData) {
    const newPost = await Post.create(postData);

    return newPost;
}

async function getAllWithMatchingText(filter) {
    const textRegex = new RegExp(filter, 'i');

    const filteredPosts = await Post
        .find({})
        .where({ text: textRegex })
        .populate({
            path: 'owner',
            select: COMMONLY_NEEDED_PARAMS
        })
        .lean();

    return filteredPosts;
}

async function remove(postId) {
    const removedPost = await Post.findByIdAndDelete(postId);

    return removedPost._id;
}

async function addLike(postId, userId) {
    const foundPost = await Post.findById(postId);

    foundPost.likes.push(userId);

    await foundPost.save();
}

const postRepositories = {
    getAllWithMatchingText,
    addLike,
    create,
    remove,
}

export default postRepositories;