import { useEffect, useState } from "react";

export default function ImageUpload({
    imageUrl,
    setImageUpload,
}) {
    const [tempImageUrl, setTempImageUrl] = useState(null);

    useEffect(() => {
        return () => {
            if (tempImageUrl) {
                URL.revokeObjectURL(tempImageUrl);
            }
        }
    }, [tempImageUrl])

    const onImageUpload = (e) => {
        const image = e.currentTarget.files[0];

        if (!image) {
            return;
        }

        setImageUpload(image);
        
        if(tempImageUrl) {
            URL.revokeObjectURL(tempImageUrl);
        }
        
        const newTempImageURL = URL.createObjectURL(image);

        setTempImageUrl(newTempImageURL);
    }

    return <>
        <div className="profile-header">
            <div className="avatar-section">
                <img src={tempImageUrl || imageUrl} className="profile-avatar" alt="Profile picture" />
                <label className="avatar-upload">
                    📷
                    <input type="file" accept="image/*" onChange={onImageUpload}/>
                </label>
            </div>
        </div>
    </>
}