export default function UserHomePage() {
    return <>
        <div className='user-home-page'>
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

            <div className="posts-section">
                <div className='post-create'>
                    <form >
                        <div className='post-header'>
                            <img src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D" />
                            <label htmlFor="post"></label>
                            <input type="text" name="post" id="post" placeholder="Share your thoughts..."/>
                        </div>
                        <button className='submit-button' >Post</button>
                    </form>
                </div>
                <div className='posts-list'>
                    <ul>
                        <li className='post-item'>
                            <div className='post-header'>
                                <div>
                                    <img className='owner-picture' src="https://plus.unsplash.com/premium_photo-1689530775582-83b8abdb5020?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmFuZG9tJTIwcGVyc29ufGVufDB8fDB8fHww" alt="" />
                                    <p className='post-owner'>John Doe</p>
                                </div>
                                <div className='created-on'>Posted 2 hours ago.</div>
                            </div>
                            <div className='post-text'>Just climbed Mount Everest! 🏔️ What an incredible experience!</div>
                            <div className='post-buttons-div'>
                                <div>
                                    <button className='post-buttons like-btn' type="button">Like</button>
                                </div>
                                <div className='owner-buttons'>
                                    <button className='post-buttons edit-btn' type="button">Edit</button>
                                    <button className='post-buttons delete-btn' type="button">Delete</button>
                                </div>
                            </div>
                        </li>
                        <li className='post-item'>
                            <div className='post-header'>
                                <div>
                                    <img className='owner-picture' src="https://plus.unsplash.com/premium_photo-1689530775582-83b8abdb5020?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmFuZG9tJTIwcGVyc29ufGVufDB8fDB8fHww" alt="" />
                                    <p className='post-owner'>John Doe</p>
                                </div>
                                <div className='created-on'>Posted 2 hours ago.</div>
                            </div>
                            <div className='post-text'>Just climbed Mount Everest! 🏔️ What an incredible experience!</div>
                            <div className='post-buttons-div'>
                                <div>
                                    <button className='post-buttons like-btn' type="button">Like</button>
                                </div>
                                <div className='owner-buttons'>
                                    <button className='post-buttons edit-btn' type="button">Edit</button>
                                    <button className='post-buttons delete-btn' type="button">Delete</button>
                                </div>
                            </div>
                        </li>
                        <li className='post-item'>
                            <div className='post-header'>
                                <div>
                                    <img className='owner-picture' src="https://plus.unsplash.com/premium_photo-1689530775582-83b8abdb5020?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmFuZG9tJTIwcGVyc29ufGVufDB8fDB8fHww" alt="" />
                                    <p className='post-owner'>John Doe</p>
                                </div>
                                <div className='created-on'>Posted 2 hours ago.</div>
                            </div>
                            <div className='post-text'>Just climbed Mount Everest! 🏔️ What an incredible experience!</div>
                            <div className='post-buttons-div'>
                                <div>
                                    <button className='post-buttons like-btn' type="button">Like</button>
                                </div>
                                <div className='owner-buttons'>
                                    <button className='post-buttons edit-btn' type="button">Edit</button>
                                    <button className='post-buttons delete-btn' type="button">Delete</button>
                                </div>
                            </div>
                        </li>
                        <li className='post-item'>
                            <div className='post-header'>
                                <div>
                                    <img className='owner-picture' src="https://plus.unsplash.com/premium_photo-1689530775582-83b8abdb5020?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmFuZG9tJTIwcGVyc29ufGVufDB8fDB8fHww" alt="" />
                                    <p className='post-owner'>John Doe</p>
                                </div>
                                <div className='created-on'>Posted 2 hours ago.</div>
                            </div>
                            <div className='post-text'>Just climbed Mount Everest! 🏔️ What an incredible experience!</div>
                            <div className='post-buttons-div'>
                                <div>
                                    <button className='post-buttons like-btn' type="button">Like</button>
                                </div>
                                <div className='owner-buttons'>
                                    <button className='post-buttons edit-btn' type="button">Edit</button>
                                    <button className='post-buttons delete-btn' type="button">Delete</button>
                                </div>
                            </div>
                        </li>
                        <li className='post-item'>
                            <div className='post-header'>
                                <div>
                                    <img className='owner-picture' src="https://plus.unsplash.com/premium_photo-1689530775582-83b8abdb5020?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmFuZG9tJTIwcGVyc29ufGVufDB8fDB8fHww" alt="" />
                                    <p className='post-owner'>John Doe</p>
                                </div>
                                <div className='created-on'>Posted 2 hours ago.</div>
                            </div>
                            <div className='post-text'>Just climbed Mount Everest! 🏔️ What an incredible experience!</div>
                            <div className='post-buttons-div'>
                                <div>
                                    <button className='post-buttons like-btn' type="button">Like</button>
                                </div>
                                <div className='owner-buttons'>
                                    <button className='post-buttons edit-btn' type="button">Edit</button>
                                    <button className='post-buttons delete-btn' type="button">Delete</button>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="friends-section">
                <h2 className='friends-counter'>Friends (248)</h2>
                <div className='friends-list'>
                    <ul>
                        <li className='friend-item'><img src="https://plus.unsplash.com/premium_photo-1689530775582-83b8abdb5020?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmFuZG9tJTIwcGVyc29ufGVufDB8fDB8fHww" alt="" />John Doe</li>
                        <li className='friend-item'><img src="https://t4.ftcdn.net/jpg/08/53/07/37/360_F_853073742_s0I2xKQU9I6aK3YUdQDMt9HL6rAuQLsQ.jpg" alt="" />John Doe</li>
                        <li className='friend-item'><img src="src\assets\images\profile-avatar.png" alt="" />John Doe</li>
                        <li className='friend-item'><img src="src\assets\images\profile-avatar.png" alt="" />John Doeaaaafsdfdsaaafsdfdsfaaasdfsdfaaaaaaaaaa</li>
                        <li className='friend-item'><img src="src\assets\images\profile-avatar.png" alt="" />John Doe</li>
                        <li className='friend-item'><img src="src\assets\images\profile-avatar.png" alt="" />John Doe</li>
                        <li className='friend-item'><img src="src\assets\images\profile-avatar.png" alt="" />John Doe</li>
                        <li className='friend-item'><img src="src\assets\images\profile-avatar.png" alt="" />John Doe</li>
                    </ul>
                </div>
            </div>
        </div>
    </>
}