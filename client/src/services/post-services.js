import postApi from "../api/post-api.js"
import { postedOnDateConverter } from "../utils/date-time-utils.js";

async function handlePostCreate(postData) {
    const newPost = await postApi.createPost(postData);

    newPost.postedOn = postedOnDateConverter(newPost.createdAt);

    return newPost;
}

const postServices = {
    handlePostCreate,
}

export default postServices