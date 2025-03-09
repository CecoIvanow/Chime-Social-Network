import postApi from "../api/post-api.js"

async function handlePostCreate(postData) {
    await postApi.createPost(postData);
}

const postServices = {
    handlePostCreate,
}

export default postServices