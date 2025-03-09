import { useEffect, useState } from "react";

import { useParams } from "react-router"
import userServices from "../services/user-services";

import defaultAvatar from '../assets/images/default-profile-avatar.png'

export default function ProfilePage() {
    const { userId } = useParams();

    const [userData, setUserData] = useState({});

    useEffect(() => {
        userServices.handleDataRequest(userId)
            .then(data => setUserData(data))
            .catch(error => console.error(error.message));
    }, [userId])

    /*
        TODO: Must implement age calculation based on birthday
    */

    return <>
        <div className="profile-container">
            <div className="profile-info-section">
                <div className="profile-header">
                    <img src={(userData.imageUrl ? userData.imageUrl : defaultAvatar)} className="profile-avatar" alt="Profile picture" />
                    <div className="profile-info">
                        <h2>{(userData.firstName)} {(userData.lastName)}</h2>
                        <p><span className="info-label">Bio:</span> {userData.bio ? userData.bio : 'N\\A'}</p>
                        <p><span className="info-label">Location:</span> {userData.location ? userData.location : 'N\\A'}</p>
                        <p><span className="info-label">Age:</span> {userData.age ? userData.age : 'N\\A'}</p>
                        <p><span className="info-label">Gender:</span> {userData.gender ? userData.gender : 'N\\A'}</p>
                        <p><span className="info-label">Occupation:</span> {userData.occupation ? userData.occupation : 'N\\A'}</p>
                        <p><span className="info-label">Education:</span> {userData.education ? userData.education : 'N\\A'}</p>
                        <p><span className="info-label">Status:</span> {userData.status ? userData.status : 'N\\A'}</p>
                        <p><span className="info-label">Member Since:</span> {userData.memberSince ? userData.memberSince : 'N\\A'}</p>
                        <a href="/edit"><button className="edit-profile-btn">Edit Profile</button></a>
                    </div>
                </div>
            </div>

            <div className="posts-section">
                <h2 className="posts-heading">My Posts ({userData.createdPosts?.length || 0})</h2>

                <div className="post-item">
                    <div className="post-header">
                        <img src="https://randomuser.me/api/portraits/men/1.jpg" className="post-author-img" alt="User avatar" />                            <div>
                            <div className="post-date">Posted 2 hours ago</div>
                        </div>
                    </div>
                    <div className="post-content">
                        Just climbed Mount Everest! What an incredible experience! Can&apos;t wait to share more photos soon.
                    </div>
                    <div className="post-actions">
                        <button className="post-button edit-btn">Edit</button>
                        <button className="post-button delete-btn">Delete</button>
                    </div>
                </div>

                <div className="post-item">
                    <div className="post-header">
                        <img src="https://randomuser.me/api/portraits/men/1.jpg" className="post-author-img" alt="User avatar" />                            <div>
                            <div className="post-date">Posted 2 hours ago</div>
                        </div>
                    </div>
                    <div className="post-content">
                        Just climbed Mount Everest! What an incredible experience! Can&apos;t wait to share more photos soon.
                    </div>
                    <div className="post-actions">
                        <button className="post-button edit-btn">Edit</button>
                        <button className="post-button delete-btn">Delete</button>
                    </div>
                </div>

                <div className="post-item">
                    <div className="post-header">
                        <img src="https://randomuser.me/api/portraits/men/1.jpg" className="post-author-img" alt="User avatar" />                            <div>
                            <div className="post-date">Posted 2 hours ago</div>
                        </div>
                    </div>
                    <div className="post-content">
                        Just climbed Mount Everest! What an incredible experience! Can&apos;t wait to share more photos soon.
                    </div>
                    <div className="post-actions">
                        <button className="post-button edit-btn">Edit</button>
                        <button className="post-button delete-btn">Delete</button>
                    </div>
                </div>

                <div className="post-item">
                    <div className="post-header">
                        <img src="https://randomuser.me/api/portraits/men/1.jpg" className="post-author-img" alt="User avatar" />                            <div>
                            <div className="post-date">Posted 2 hours ago</div>
                        </div>
                    </div>
                    <div className="post-content">
                        Just climbed Mount Everest! What an incredible experience! Can&apos;t wait to share more photos soon.
                    </div>
                    <div className="post-actions">
                        <button className="post-button edit-btn">Edit</button>
                        <button className="post-button delete-btn">Delete</button>
                    </div>
                </div>

                <div className="post-item">
                    <div className="post-header">
                        <img src="https://randomuser.me/api/portraits/men/1.jpg" className="post-author-img" alt="User avatar" />                            <div>
                            <div className="post-date">Posted 2 hours ago</div>
                        </div>
                    </div>
                    <div className="post-content">
                        Just climbed Mount Everest! What an incredible experience! Can&apos;t wait to share more photos soon.
                    </div>
                    <div className="post-actions">
                        <button className="post-button edit-btn">Edit</button>
                        <button className="post-button delete-btn">Delete</button>
                    </div>
                </div>

            </div>
        </div>
    </>
}