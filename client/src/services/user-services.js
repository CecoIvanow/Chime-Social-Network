import userApi from "../api/user-api.js";

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

const userServices = {
    handleRegister,
    handleLogout,
    handleLogin,
}

export default userServices;