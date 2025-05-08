import ProfileSection from "../../shared/profile/profile-section/ProfileSection";
import PostsSection from "../../shared/post/posts-section/PostsSection";

export default function ProfilePage() {
    return (
        <div className="profile-container">
            <ProfileSection />
            <PostsSection />
        </div>
    )
}