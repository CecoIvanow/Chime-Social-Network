import { useEffect, useState } from "react";
import { useParams } from "react-router"

import userServices from "../services/user-services";

import PostItem from "../components/PostItem";
import CreatePostItem from "../components/CreatePostItem";

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
            <div className="profile-info-section">
                <div className="profile-header">
                    <img src={userData.imageUrl} className="profile-avatar" alt="Profile picture" />
                    <div className="profile-info">
                        <h2>{(userData.firstName)} {(userData.lastName)}</h2>
                        <p><span className="info-label">Bio:</span> {userData.bio ? userData.bio : 'N\\A'}</p>
                        <p><span className="info-label">Age:</span> {userData.age ? userData.age : 'N\\A'}</p>
                        <p><span className="info-label">Gender:</span> {userData.gender ? userData.gender : 'N\\A'}</p>
                        <p><span className="info-label">Location:</span> {userData.location ? userData.location : 'N\\A'}</p>
                        <p><span className="info-label">Occupation:</span> {userData.occupation ? userData.occupation : 'N\\A'}</p>
                        <p><span className="info-label">Education:</span> {userData.education ? userData.education : 'N\\A'}</p>
                        <p><span className="info-label">Status:</span> {userData.status ? userData.status : 'N\\A'}</p>
                        <p><span className="info-label">Member Since:</span> {userData.memberSince ? userData.memberSince : 'N\\A'}</p>
                        {isUser && (
                            <a href="/edit"><button className="edit-profile-btn">Edit Profile</button></a>
                        )}
                    </div>
                </div>
            </div>

            <div className="posts-section">
                <h2 className="posts-heading">{isUser ? 'My' : `${userData.firstName}'s`} Posts:</h2>
                {isUser && (
                    <CreatePostItem
                        isUser={isUser}
                        userId={userId}
                        imageUrl={userData.imageUrl}
                        totalUserPosts={totalUserPosts}
                        setTotalUserPosts={setTotalUserPosts}
                    />
                )}

                {totalUserPosts.map(post =>
                    <PostItem
                        ownerId={post.owner}
                        isUser={isUser}
                        key={post._id}
                        text={post.text}
                        postedOn={post.postedOn}
                        imageUrl={userData.imageUrl}
                        fullName={`${userData.firstName} ${userData.lastName}`}
                    />
                )}

            </div>
        </div>
    </>
}