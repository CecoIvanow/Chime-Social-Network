import userClientApi from "../client-api/user-client-api.js";

async function registerMiddleware(data) {
    await userClientApi.register(data);
}

const userServices = {
    registerMiddleware
}

export default userServices;