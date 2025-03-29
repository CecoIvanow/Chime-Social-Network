import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router"

import userServices from "../../../services/user-services";

import PostItem from "../../shared/post/post-item/PostItem";
import PostCreateForm from "../../shared/post/post-create-form/PostCreateForm";
import SectionHeading from "../../ui/headings/SectionHeading";
import ProfileSection from "../../shared/profile/profile-section/ProfileSection";

import { UserContext } from "../../../contexts/user-context";
import { TotalPostsContext } from "../../../contexts/total-posts-context";

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

                <div className="posts-section">
                    <SectionHeading
                        sectionName={isUser === userData._id ? 'My Posts:' : `${userData.firstName}'s Posts:`}
                    />

                    {(isUser && isUser === userData._id) && (
                        <PostCreateForm />
                    )}

                    {totalPosts.map(post => 
                        <PostItem
                            key={post._id}
                            post={post}
                        />
                    )}

                </div>
            </div>
        </TotalPostsContext.Provider>
    )
}