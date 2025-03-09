import userApi from "../api/user-api.js";
import { memberSinceDateConverter } from "../utils/date-time-utils.js";

async function handleRegister(data, setIsUser) {
    const userId = await userApi.register(data);
    
    setIsUser(userId);
}

async function handleLogin(data, setIsUser) {
    const userId = await userApi.login(data);

    setIsUser(userId);
}

async function handleLogout(setIsUser) {
    await userApi.logout();
    
    setIsUser(false);
}

async function handleDataRequest(userId) {
    const userData = await userApi.retrieveUserData(userId);

    userData.memberSince = memberSinceDateConverter(userData.createdAt);

    return userData;
}

const userServices = {
    handleDataRequest,
    handleRegister,
    handleLogout,
    handleLogin,
}

export default userServices;