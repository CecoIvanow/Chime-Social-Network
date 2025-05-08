import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";

import LoadingSpinner from "../../../ui/loading-spinner/LoadingSpinner";
import ProfileHeader from "./profile-header/ProfileHeader";

import useUserServices from "../../../../hooks/useUserServices";

import { AlertContext } from "../../../../contexts/alert-context";

export default function ProfileSection() {
    const { userId } = useParams();

    const { setAlert } = useContext(AlertContext);

    const { getUserData, isLoading } = useUserServices()

    const [userData, setUserData] = useState({});

    useEffect(() => {
        getUserData(userId)
            .then(data => {
                setUserData(data);
            })
            .catch(error => {
                console.error(error);
                setAlert(error.message)
            });
    }, [userId, getUserData, setAlert]);

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