import { useContext, useCallback, useEffect } from "react";
import { UserContext } from "../../../../../contexts/user-context";
import { AlertContext } from "../../../../../contexts/alert-context";
import useUserServices from "../../../../../hooks/useUserServices";
import UserItem from "./user-item/UserItem";

export default function UsersList({ matchingUsers }) {
    const { isUser } = useContext(UserContext);
    const { setAlert } = useContext(AlertContext);
    const { addFriend, removeFriend, abortAll } = useUserServices();

    // Memoizing the functions to avoid unnecessary re-renders
    const handleAddFriend = useCallback(
        async (user) => {
            try {
                await addFriend(isUser, user._id);
                return true;
            } catch (error) {
                console.error(error);
                setAlert(error.message);
                return false;
            }
        },
        [isUser, addFriend, setAlert] // Memoized function will be recomputed if these dependencies change
    );

    const handleRemoveFriend = useCallback(
        async (user) => {
            try {
                await removeFriend(isUser, user._id);
                return true;
            } catch (error) {
                console.error(error);
                setAlert(error.message);
                return false;
            }
        },
        [isUser, removeFriend, setAlert] // Dependencies: will re-create the callback if these change
    );
    
    useEffect(() => {
        return () => {
            abortAll();
        };
    }, [abortAll]);

    return (
        <>
            {matchingUsers?.map((user) => (
                <UserItem
                    key={user._id}
                    user={user}
                    handleAddFriend={handleAddFriend}
                    handleRemoveFriend={handleRemoveFriend}
                />
            ))}
        </>
    );
}
