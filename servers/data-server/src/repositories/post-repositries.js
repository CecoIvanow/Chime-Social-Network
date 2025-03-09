import Post from "../models/Post.js";

async function fetchAll() {
    const allPosts = await Post.find({}).lean();

    return allPosts
}

async function create(postData) {
    const newPost = await Post.create(postData);
    
    return newPost;
}

const postRepositories ={
    fetchAll,
    create,
}

export default postRepositories;