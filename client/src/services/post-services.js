import postApi from "../api/post-api.js"
import { postedOnDateConverter } from "../utils/date-time-utils.js";

async function handleGetAllPosts() {
    const allPosts = await postApi.getAll();

    allPosts.map(post => post.postedOn = postedOnDateConverter(post.createdAt))

    return allPosts
}

async function handlePostCreate(postData) {
    const newPost = await postApi.createPost(postData);

    newPost.postedOn = postedOnDateConverter(newPost.createdAt);

    return newPost;
}

const postServices = {
    handleGetAllPosts,
    handlePostCreate,
}

export default postServices