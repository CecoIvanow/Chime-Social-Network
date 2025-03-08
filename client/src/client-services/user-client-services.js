import userClientApi from "../client-api/user-client-api.js";

async function registerMiddleware(data, setIsUser) {
    const userId = await userClientApi.register(data);
    
    setIsUser(userId);
}

const userServices = {
    registerMiddleware
}

export default userServices;