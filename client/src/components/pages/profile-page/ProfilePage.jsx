import { useEffect, useState } from "react";
import { useParams } from "react-router"

import userServices from "../../../services/user-services";

import PostItem from "../../shared/post/post-item/PostItem";
import PostCreateForm from "../../shared/post/post-create-form/PostCreateForm";
import LinkButton from "../../ui/buttons/link-button/LinkButton";
import SectionHeading from "../../ui/headings/SectionHeading";
import ProfileDataSection from "../../shared/profile/ProfileDataSection";

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
            <ProfileDataSection
                isUser={isUser}
                userData={userData}
            />

            <div className="posts-section">
                <SectionHeading
                    sectionName={isUser === userData._id ? 'My Posts:' : `${userData.firstName}'s Posts:`}
                />

                {(  isUser === userData._id) && (
                    <PostCreateForm
                        userId={userId}
                        totalUserPosts={totalUserPosts}
                        setTotalUserPosts={setTotalUserPosts}
                    />
                )}

                {totalUserPosts.map(post => {
                    const postMetaData = {
                        id: post._id,
                        text: post.text,
                        postedOn: post.postedOn,
                        likes: post.likes,
                        comments: post.comments
                    }

                    const creatorDetails = {
                        id: post.owner,
                        imageUrl: userData.imageUrl,
                        fullName: `${userData.firstName} ${userData.lastName}`
                    }

                    return <PostItem
                        key={post._id}
                        postMetaData={postMetaData}
                        creatorDetails={creatorDetails}
                        userId={isUser}
                        setTotalPosts={setTotalUserPosts}
                        totalPosts={totalUserPosts}
                    />
                })}

            </div>
        </div>
    </>
}