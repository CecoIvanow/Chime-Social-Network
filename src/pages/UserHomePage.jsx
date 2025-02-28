import '../static/styles/UserHomePage.css'

export default function UserHomePage() {
    return <>
        <div className='user-home-page'>
            <div className="profile-section">
                <div className='profile-avatar'>
                    <img className='profile-picture' src="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg" alt="" />
                </div>
                <div className='profile-info'>
                    <h2>John Doe</h2>
                    <p>New York, USA</p>
                    <p>27 years old</p>
                    <p>Web Developer</p>
                    <p>Harvard University</p>
                    <p>Single</p>
                    <p>Joined February 2025</p>
                </div>
            </div>

            <div className="posts-section">
                <div className='post-create'>
                    <form >
                        <div className='post-header'>
                            <img src="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg" />
                            <label htmlFor="post"></label>
                            <input type="text" name="post" id="post" />
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
                        <li className='friend-item'><img src="src\static\images\profile-avatar.png" alt="" />John Doe</li>
                        <li className='friend-item'><img src="src\static\images\profile-avatar.png" alt="" />John Doeaaaafsdfdsaaafsdfdsfaaasdfsdfaaaaaaaaaa</li>
                        <li className='friend-item'><img src="src\static\images\profile-avatar.png" alt="" />John Doe</li>
                        <li className='friend-item'><img src="src\static\images\profile-avatar.png" alt="" />John Doe</li>
                        <li className='friend-item'><img src="src\static\images\profile-avatar.png" alt="" />John Doe</li>
                        <li className='friend-item'><img src="src\static\images\profile-avatar.png" alt="" />John Doe</li>
                    </ul>
                </div>
            </div>
        </div>
    </>
}