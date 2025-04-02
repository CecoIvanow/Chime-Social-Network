import PostsCatalog from "./posts-catalog/PostsCatalog";
import UsersCatalog from "./users-catalog/UsersCatalog";


export default function CatalogPage() {
    return (
        <div className="dashboard-container">
            <PostsCatalog />
            <UsersCatalog />
        </div>
    )
}