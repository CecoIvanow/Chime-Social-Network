import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router"

import userServices from "../../../services/user-services";

import ProfileSection from "../../shared/profile/profile-section/ProfileSection";

import { UserContext } from "../../../contexts/user-context";
import { TotalPostsContext } from "../../../contexts/total-posts-context";
import PostsSection from "../../shared/post/posts-section/PostsSection";

export default function ProfilePage() {
    const { userId } = useParams();

    const { isUser } = useContext(UserContext)

    const [userData, setUserData] = useState({});
    const [totalPosts, setTotalPosts] = useState([]);

    useEffect(() => {
        const abortController = new AbortController();

        const abortSignal = abortController.signal;

        userServices.handleUserDataWithPosts(userId, abortSignal)
            .then(data => {
                setUserData(data);
                setTotalPosts(data.createdPosts.reverse());
            })
            .catch(error => console.error(error.message));

        return () => {
            abortController.abort();
        }
    }, [userId])

    return (
        <TotalPostsContext.Provider value={{ totalPosts, setTotalPosts }}>
            <div className="profile-container">
                <ProfileSection
                    userData={userData}
                />

                <PostsSection
                    sectionHeadingName={isUser === userData._id ? 'My Posts:' : `${userData.firstName}'s Posts:`}
                    userData={userData}
                />
            </div>
        </TotalPostsContext.Provider>
    )
}