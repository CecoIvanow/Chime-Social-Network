import { useContext, useEffect, useState } from "react";

import PostsCatalog from "./posts-catalog/PostsCatalog";
import UsersCatalog from "./users-catalog/UsersCatalog";

import { AlertContext } from "../../../contexts/alert-context";

import usePostServices from "../../../hooks/usePostServices";
import useUserServices from "../../../hooks/useUserServices";

export default function CatalogPage() {
    const [totalUsers, setTotalUsers] = useState([]);
    const [totalPosts, setTotalPosts] = useState([]);

    const { setAlert } = useContext(AlertContext);

    const { getAllPosts, isLoading: isLoadingPosts, abortAll: abortPostRequests } = usePostServices();
    const { getAllUsers, isLoading: isLoadingUsers, abortAll: abortUserRequests } = useUserServices();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [allUsers, allPosts] = await Promise.all([
                    getAllUsers(),
                    getAllPosts(),
                ])

                setTotalUsers(allUsers);
                setTotalPosts(allPosts);
            } catch (error) {
                console.error(error);
                setAlert(error.message);
            }

        }
        fetchData();

        return () => {
            abortUserRequests();
            abortPostRequests();
        }
    }, [setAlert, getAllUsers, getAllPosts, abortUserRequests, abortPostRequests]);

    return (
        <div className="dashboard-container">
            <PostsCatalog
                setTotalPosts={setTotalPosts}
                totalPosts={totalPosts}
                isLoading={isLoadingPosts}
            />

            <UsersCatalog
                totalUsers={totalUsers}
                isLoading={isLoadingUsers}
            />
        </div>
    )
}