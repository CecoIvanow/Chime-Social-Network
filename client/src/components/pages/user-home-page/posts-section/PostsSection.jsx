import { useState } from "react";

import PostCreateForm from "../../../shared/post/post-create-form/PostCreateForm";
import PostItem from "../../../shared/post/post-item/PostItem";
import SectionHeading from '../../../ui/headings/SectionHeading'

import { TotalPostsContext } from "../../../../contexts/total-posts-context";

export default function PostsSection() {
    const [totalPosts, setTotalPosts] = useState([]);
    return (
        <TotalPostsContext.Provider value={{ totalPosts, setTotalPosts }}>
            <div className="posts-section">
                <SectionHeading
                    sectionName="Friends' posts:"
                />

                <PostCreateForm />

                <div className='posts-list'>
                <PostItem />
                <PostItem />
                <PostItem />
                <PostItem />
                </div>
            </div>
        </TotalPostsContext.Provider>
    )
}