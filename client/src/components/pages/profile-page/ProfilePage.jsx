import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router"

import userServices from "../../../services/user-services";

import ProfileSection from "../../shared/profile/profile-section/ProfileSection";
import PostsSection from "../../shared/post/posts-section/PostsSection";

import { UserContext } from "../../../contexts/user-context";
import { TotalPostsContext } from "../../../contexts/total-posts-context";
import { AlertContext } from "../../../contexts/alert-context";

export default function ProfilePage() {
    const { userId } = useParams();

    const { isUser } = useContext(UserContext);
    const { setAlert } = useContext(AlertContext);

    const [userData, setUserData] = useState({});
    const [totalPosts, setTotalPosts] = useState([]);

    useEffect(() => {
        const abortController = new AbortController();

        const abortSignal = abortController.signal;

        userServices.handleGetUserDataWithPosts(userId, { abortSignal })
            .then(data => {
                setUserData(data);
                setTotalPosts(data?.createdPosts.reverse());
            })
            .catch(error => {
                console.error(error);
                setAlert(error.message)
            });

        return () => {
            abortController.abort();
        }
    }, [userId, setAlert])

    return (
        <TotalPostsContext.Provider value={{ totalPosts, setTotalPosts }}>
            <div className="profile-container">
                <ProfileSection
                    userData={userData}
                />

                <PostsSection
                    sectionHeadingName={isUser === userData?._id ? 'My Posts:' : `${userData?.firstName}'s Posts:`}
                    userData={userData}
                />
            </div>
        </TotalPostsContext.Provider>
    )
}