import Post from "../models/Post.js";

async function create(postData) {
    const newPost = await Post.create(postData);
    
    return newPost;
}

const postRepositories ={
    create
}

export default postRepositories;