import userClientApi from "../client-api/user-client-api.js";

async function registerMiddleware(data, setIsUser, navigateTo) {
    const userId = await userClientApi.register(data);
    setIsUser(userId);
    navigateTo('/');
}

const userServices = {
    registerMiddleware
}

export default userServices;