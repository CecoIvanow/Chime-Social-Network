import Post from "../models/Post.js";

async function fetchAllWithOwners() {
    const allPosts = await Post.find({}).populate({
        path: 'owner',
        select: 'firstName lastName imageUrl'
    });

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