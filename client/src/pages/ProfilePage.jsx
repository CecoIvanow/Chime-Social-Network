import { useEffect, useState } from "react";
import { useParams } from "react-router"

import userServices from "../services/user-services";

import defaultAvatar from '../assets/images/default-profile-avatar.png'
import PostItem from "../components/PostItem";
import CreatePostItem from "../components/CreatePostItem";

export default function ProfilePage({
    isUser
}) {
    const { userId } = useParams();

    const [userData, setUserData] = useState({});
    const [totalUserPosts, setTotalUserPosts] = useState([]);

    useEffect(() => {
        userServices.handleUserDataWithPosts(userId)
            .then(data => {
                setUserData(data);
                setTotalUserPosts(data.createdPosts.reverse());
            })
            .catch(error => console.error(error.message));
    }, [userId])

    return <>
        <div className="profile-container">
            <div className="profile-info-section">
                <div className="profile-header">
                    <img src={(userData.imageUrl ? userData.imageUrl : defaultAvatar)} className="profile-avatar" alt="Profile picture" />
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
                <h2 className="posts-heading">{isUser ? 'My' : `${userData.firstName}'s`} Posts ({totalUserPosts.length})</h2>
                {isUser && (
                    <CreatePostItem
                        isUser={isUser}
                        userId={userId}
                        imageUrl={(userData.imageUrl ? userData.imageUrl : defaultAvatar)}
                        totalUserPosts={totalUserPosts}
                        setTotalUserPosts={setTotalUserPosts}
                    />
                )}

                {totalUserPosts.map(post =>
                    <PostItem
                        isUser={isUser}
                        key={post._id}
                        text={post.text}
                        postedOn={post.postedOn}
                        imageUrl={(userData.imageUrl ? userData.imageUrl : defaultAvatar)}
                    />
                )}

            </div>
        </div>
    </>
}