import userApi from "../api/user-api.js";

async function handleRegister(data, setIsUser) {
    const userId = await userApi.register(data);
    
    setIsUser(userId);
}

const userServices = {
    handleRegister
}

export default userServices;