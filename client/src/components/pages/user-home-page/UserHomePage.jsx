import FriendsSection from "./friends-section/FriendsSection";
import ProfileSection from "./profile-section/ProfileSection";
import PostsSection from "./posts-section/PostsSection";

export default function UserHomePage({
    isUser: userId
}) {
    return <>
        <div className='user-home-page'>
            <ProfileSection />

            <PostsSection
                userId={userId}
            />

            <FriendsSection />
        </div>
    </>
}