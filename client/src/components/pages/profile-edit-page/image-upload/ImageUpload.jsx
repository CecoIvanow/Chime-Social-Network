export default function ImageUpload({
    imageUrl,
    setImageUpload,
}) {
    const onImageUpload = (e) => {
        setImageUpload(e.currentTarget.files[0])
    }

    return <>
        <div className="profile-header">
            <div className="avatar-section">
                <img src={imageUrl} className="profile-avatar" alt="Profile picture" />
                <label className="avatar-upload">
                    📷
                    <input type="file" accept="image/*" onChange={onImageUpload}/>
                </label>
            </div>
        </div>
    </>
}