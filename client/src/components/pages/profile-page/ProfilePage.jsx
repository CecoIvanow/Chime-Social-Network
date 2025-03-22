import { useEffect, useState } from "react";
import { useParams } from "react-router"

import userServices from "../../../services/user-services";

import PostItem from "../../shared/post/post-item/PostItem";
import PostCreateForm from "../../shared/post/post-create-form/PostCreateForm";
import SectionHeading from "../../ui/headings/SectionHeading";
import ProfileInfoSection from "../../shared/profile/ProfileInfoSection";

export default function ProfilePage({
    isUser
}) {
    const { userId } = useParams();

    const [userData, setUserData] = useState({});
    const [totalUserPosts, setTotalUserPosts] = useState([]);

    useEffect(() => {
        const abortController = new AbortController();

        const abortSignal = abortController.signal;

        userServices.handleUserDataWithPosts(userId, abortSignal)
            .then(data => {
                setUserData(data);
                setTotalUserPosts(data.createdPosts.reverse());
            })
            .catch(error => console.error(error.message));

        return () => {
            abortController.abort();
        }
    }, [userId])

    return <>
        <div className="profile-container">
            <ProfileInfoSection
                isUser={isUser}
                userData={userData}
            />

            <div className="posts-section">
                <SectionHeading
                    sectionName={isUser === userData._id ? 'My Posts:' : `${userData.firstName}'s Posts:`}
                />

                {(isUser && isUser === userData._id) && (
                    <PostCreateForm
                        userId={userId}
                        totalUserPosts={totalUserPosts}
                        setTotalUserPosts={setTotalUserPosts}
                    />
                )}

                {totalUserPosts.map(post => {
                    post.owner = {
                        _id: userData._id,
                        imageUrl: userData.imageUrl,
                        lastName: userData.lastName,
                        firstName: userData.firstName,
                    };

                    return <PostItem
                        key={post._id}
                        post={post}
                        userId={isUser}
                        totalPosts={totalUserPosts}
                        setTotalPosts={setTotalUserPosts}
                    />
                })}

            </div>
        </div>
    </>
}