import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";

import PostCreateForm from "../post-create-form/PostCreateForm";
import SectionHeading from '../../../ui/headings/SectionHeading'
import PostsList from "../posts-list/PostsList";
import LoadingSpinner from "../../../ui/loading-spinner/LoadingSpinner";

import { UserContext } from "../../../../contexts/user-context";
import { AlertContext } from "../../../../contexts/alert-context";
import { TotalPostsContext } from "../../../../contexts/total-posts-context";

import useUserServices from "../../../../hooks/useUserServices";

export default function PostsSection() {
    const { userId } = useParams();

    const { isUser } = useContext(UserContext);
    const { setAlert } = useContext(AlertContext);

    const [totalPosts, setTotalPosts] = useState([]);
    const [userName, setUserName] = useState(null);

    const { getUserPosts, isLoading } = useUserServices();
    
    useEffect(() => {
        getUserPosts(userId)
            .then(data => {
                setTotalPosts(data?.createdPosts);
                setUserName(data?.firstName);
            })
            .catch(error => {
                console.error(error);
                setAlert(error.message)
            });
    }, [getUserPosts, userId, setAlert]);

    return (
        <TotalPostsContext.Provider value={{ totalPosts, setTotalPosts }}>
            <div className="posts-section">
                <SectionHeading
                    sectionName={isUser === userId ? 'My Posts:' : `${userName}'s Posts:`}
                />

                {(isUser && isUser === userId) && (
                    <PostCreateForm />
                )}

                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    <PostsList />
                )}

            </div>
        </TotalPostsContext.Provider>
    )
}