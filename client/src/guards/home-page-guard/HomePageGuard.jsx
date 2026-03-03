import { useContext } from "react";

import { UserContext } from "../../contexts/user-context";

import UserHomePage from "../../components/pages/user-home-page/UserHomePage";
import LandingPage from "../../components/pages/landing-page/LandingPage";

export default function HomePageGuard() {
    const { loggedInUserId } = useContext(UserContext);

    if (loggedInUserId) {
        return <UserHomePage />;
    }

    return <LandingPage />;
};