import Post from "../models/Post.js";

const COMMONLY_NEEDED_PARAMS = 'firstName lastName imageUrl'

async function fetchAllWithOwners() {
    const allPosts = await Post
        .find({})
        .populate({
            path: 'owner',
            select: COMMONLY_NEEDED_PARAMS
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
        .where({ text: textRegex })
        .populate({
            path: 'owner',
            select: COMMONLY_NEEDED_PARAMS
        })
        .lean();

    return filteredPosts;
}

const postRepositories = {
    getAllWithMatchingText,
    create,
}

export default postRepositories;