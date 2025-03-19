export default function ProfileSection() {
    return <>
        <div className="profile-section">
            <div className='profile-user-avatar'>
                <img className='profile-picture' src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D" alt="" />
            </div>
            <div className="profile-info">
                <h2>John Doe</h2>
                <p><span className="info-label">Bio:</span> Some random bio about the user which might or might not be important, currently in testing phase</p>
                <p><span className="info-label">Location:</span> New York, USA</p>
                <p><span className="info-label">Age:</span> 27 years</p>
                <p><span className="info-label">Occupation:</span> Web Developer</p>
                <p><span className="info-label">Education:</span> Harvard University</p>
                <p><span className="info-label">Status:</span> Single</p>
                <p><span className="info-label">Member Since:</span> February 2025</p>
            </div>
        </div>
    </>
}