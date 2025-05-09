import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";

import ProfileSection from "../../shared/profile/profile-section/ProfileSection";
import PostsSection from "../../shared/post/posts-section/PostsSection";

import { AlertContext } from "../../../contexts/alert-context";
import { TotalPostsContext } from "../../../contexts/total-posts-context";

import useUserServices from "../../../hooks/useUserServices";

export default function ProfilePage() {
    const { userId } = useParams();

    const [userData, setUserData] = useState({});
    const [totalPosts, setTotalPosts] = useState([]);

    const { setAlert } = useContext(AlertContext);

    const { getUserData, getUserPosts, isLoading, abortAll } = useUserServices();

    useEffect(() => {
        async function fetchData() {
            try {
                const [userData, userPosts] = await Promise.all([
                    getUserData(userId),
                    getUserPosts(userId),
                ])
                
                setUserData(userData);
                setTotalPosts(userPosts?.createdPosts.reverse());
                
            } catch (error) {
                console.error(error);
                setAlert(error);
            }
        }
        fetchData();

        return () => {
            abortAll();
        }
    }, [getUserData, getUserPosts, userId, setAlert, abortAll]);

    const totalPostsContextValues = {
        totalPosts,
        setTotalPosts
    }

    return (
        <div className="profile-container">
            <ProfileSection
                isLoading={isLoading}
                userData={userData}
            />

            <TotalPostsContext.Provider value={totalPostsContextValues}>
                <PostsSection
                    isLoading={isLoading}
                    userName={userData?.firstName}
                />
            </TotalPostsContext.Provider>
        </div>
    )
}