import Post from "../models/Post.js";

async function fetchAllWithOwners() {
    const allPosts = await Post.find({}).lean();

    return allPosts
}

async function create(postData) {
    const newPost = await Post.create(postData);
    
    return newPost;
}

const postRepositories ={
    fetchAllWithOwners,
    create,
}

export default postRepositories;