import userClientApi from "../client-api/user-client-api.js";

async function registerMiddleware(data, actions) {
    const userId = await userClientApi.register(data);
    actions.setIsUser(userId);
    actions.navigateTo('/');
}

const userServices = {
    registerMiddleware
}

export default userServices;