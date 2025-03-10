import userApi from "../api/user-api.js";
import { ageCalculator, memberSinceDateConverter, postedOnDateConverter } from "../utils/date-time-utils.js";

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

async function handleUserDataWithPosts(userId) {
    const userData = await userApi.retrieveUserWithPosts(userId);

    userData.memberSince = memberSinceDateConverter(userData.createdAt);
    userData.age = ageCalculator(userData.birthday);
    userData.createdPosts.map(post => post.postedOn = postedOnDateConverter(post.createdAt));

    return userData;
}

async function handleGetAll() {
    const allUsers = await userApi.getAll();
    
    allUsers.map(user => user.memberSince = memberSinceDateConverter(user.createdAt));

    return allUsers;
}

const userServices = {
    handleUserDataWithPosts,
    handleRegister,
    handleLogout,
    handleLogin,
    handleGetAll,
}

export default userServices;