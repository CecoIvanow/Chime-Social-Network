import { useContext, useEffect, useState } from "react";

import LoadingSpinner from "../../../ui/loading-spinner/LoadingSpinner";
import ProfileHeader from "./profile-header/ProfileHeader";

import useUserServices from "../../../../hooks/useUserServices";

import { UserContext } from "../../../../contexts/user-context";
import { AlertContext } from "../../../../contexts/alert-context";

export default function ProfileSection() {
    const { isUser } = useContext(UserContext);
    const { setAlert } = useContext(AlertContext);

    const { getUserData, isLoading } = useUserServices()

    const [userData, setUserData] = useState({});

    useEffect(() => {
        getUserData(isUser)
            .then(data => {
                setUserData(data);
            })
            .catch(error => {
                console.error(error);
                setAlert(error.message)
            });
    }, [isUser, getUserData, setAlert]);

    return <>
        <div className="profile-info-section">
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <ProfileHeader
                    userData={userData}
                />
            )}
        </div>
    </>
}