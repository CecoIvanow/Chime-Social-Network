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

const userServices = {
    handleUserDataWithPosts,
    handleRegister,
    handleLogout,
    handleLogin,
}

export default userServices;