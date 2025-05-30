import { useContext, useEffect, useState } from "react";

import { TotalPostsContext } from "../../../contexts/total-posts-context";
import { UserContext } from "../../../contexts/user-context";
import { AlertContext } from "../../../contexts/alert-context";

import FriendsSection from "./friends-section/FriendsSection";
import PostsSection from "../../shared/post/posts-section/PostsSection";
import ProfileSection from "../../shared/profile/profile-section/ProfileSection";

import useUserServices from "../../../hooks/useUserServices";

export default function UserHomePage() {
    const { isUser } = useContext(UserContext)
    const { setAlert } = useContext(AlertContext);

    const [userData, setUserData] = useState({});
    const [totalPosts, setTotalPosts] = useState([]);
    const [userFriends, setUserFriends] = useState([]);

    const { getFullUserProfile, isLoading, abortAll } = useUserServices();

    useEffect(() => {
        getFullUserProfile(isUser)
            .then(userData => {
                setUserData(userData);
                setUserFriends(userData?.friends);
                setTotalPosts(() => {
                    const posts = [];

                    userData?.friends.forEach(friend => friend.createdPosts?.forEach(post => posts.push(post)));
                    userData?.createdPosts.forEach(post => posts.push(post));
                    posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                    return posts
                })
            })
            .catch(error => {
                console.error(error);
                setAlert(error.message);
            });

        return () => {
            abortAll();
        }
    }, [isUser, setAlert, getFullUserProfile, abortAll]);

    const totalPostsContextValues = {
        totalPosts,
        setTotalPosts
    }

    return <>
        <div className='user-home-page'>
            <ProfileSection
                userData={userData}
                isLoading={isLoading}
            />

            <TotalPostsContext.Provider value={totalPostsContextValues}>
                <PostsSection
                    userName={userData?.firstName}
                    isLoading={isLoading}
                />
            </TotalPostsContext.Provider>

            <FriendsSection
                isLoading={isLoading}
                userFriends={userFriends}
            />

        </div >
    </>
}