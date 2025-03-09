export default function UserItem() {
    return <>
        <div className="user-item">
            <img src="https://randomuser.me/api/portraits/women/1.jpg" className="user-avatar" alt="User avatar" />
            <div className="user-info">
                <div className="user-name">Jane Smith</div>
                <div className="user-details">
                    <div>Joined: Feb 2024</div>
                    <div>Posts: 45</div>
                </div>
            </div>
            <button className="action-button">Add</button>
        </div>
    </>
}