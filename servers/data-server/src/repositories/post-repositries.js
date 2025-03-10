import Post from "../models/Post.js";

async function fetchAllWithOwners() {
    const allPosts = await Post
        .find({})
        .populate({
            path: 'owner',
            select: 'firstName lastName imageUrl'
        })
        .lean();

    return allPosts
}

async function create(postData) {
    const newPost = await Post.create(postData);

    return newPost;
}

async function getAllWithMatchingText(filter) {
    const textRegex = new RegExp(filter, 'i');

    const filteredPosts = await Post
        .find({})
        .where({text: textRegex})
        .populate({
            path: 'owner',
            select: 'firstName lastName imageUrl'
        })
        .lean();

    return filteredPosts;
}

const postRepositories = {
    getAllWithMatchingText,
    fetchAllWithOwners,
    create,
}

export default postRepositories;