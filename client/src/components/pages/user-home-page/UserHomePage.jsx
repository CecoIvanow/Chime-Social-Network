import { useContext, useEffect, useState } from "react";

import userServices from "../../../services/user-services";

import { TotalPostsContext } from "../../../contexts/total-posts-context";
import { UserContext } from "../../../contexts/user-context";

import FriendsSection from "./friends-section/FriendsSection";
import PostsSection from "./posts-section/PostsSection";
import ProfileSection from "../../shared/profile/profile-section/ProfileSection";

export default function UserHomePage() {
    const { isUser } = useContext(UserContext)


    const [userData, setUserData] = useState({});
    const [totalPosts, setTotalPosts] = useState([]);
    const [userFriends, setUserFriends] = useState([]);

    useEffect(() => {
        const abortController = new AbortController();

        const abortSignal = abortController.signal;

        userServices.handleGetUserWithFriendsAndPosts(isUser, abortSignal)
            .then(data => {
                setUserData(data);
                setUserFriends(data.friends);
            })
            .catch(error => console.error(error.message));

        return () => {
            abortController.abort();
        }
    }, [isUser])

    return <>
        <div className='user-home-page'>
            <ProfileSection
                userData={userData}
            />

            <TotalPostsContext.Provider value={{ totalPosts, setTotalPosts }}>
                <PostsSection
                    sectionHeadingName='Friends Posts:'
                    userData={userData}
                />
            </TotalPostsContext.Provider>

            <FriendsSection
                userFriends={userFriends}
            />
            
        </div >
    </>
}