import { Link } from "react-router"

export default function PostDetails() {
    return <>
        <li className='post-page-body'>
            <div className='post-page-header'>
                <div>
                    <img className='owner-picture' src="" alt="" />
                    <p className='post-owner'><Link>Lacho Lachkov</Link></p>
                </div>
                <div className='created-on'>Posted on 2025-03-15 in 15:39</div>
            </div>
            <div className='post-page-text'>Filler Text</div>
            <div className="post-interactions">
                <div className="likes">Likes: 1</div>
                <div className="comments">Comments: 2</div>
            </div>
            <div className='button-div'>
                <div>
                    <button className='button unlike-btn' type="button">Unlike</button>
                    <button className='button' type="button">Like</button>
                </div>
                <div className='owner-buttons'>
                    <button className='button' type="button">Edit</button>
                    <button className='button delete-btn' type="button">Delete</button>
                </div>
            </div>
            <div className="comments-section">
                <form>
                    <div className='comment-create'>
                        <img src="" />
                        <label htmlFor="comment"></label>
                        <input type="text" name="text" id="comment" placeholder="Add your comment..." />
                    </div>
                    <button className='button comment-btn' type="button">Comment</button>
                </form>
                <div className="post-comments">
                    <p>All Comments:</p>
                    <ul>
                        <li className='comment-item'>
                            <div className='post-header'>
                                <div>
                                    <img className='owner-picture' src="" alt="" />
                                    <p className='post-owner'><Link to="">Ivan Ivanov</Link></p>
                                </div>
                                <div className='commented-on'>Posted on today</div>
                            </div>
                            <div className='post-text'>I agree!</div>
                            <div className='button-div'>
                                <div>
                                </div>
                                <div className='owner-buttons'>
                                    <button className='button' type="button">Edit</button>
                                    <button className='button delete-btn' type="button">Delete</button>
                                </div>
                            </div>
                        </li >
                        <li className='comment-item'>
                            <div className='post-header'>
                                <div>
                                    <img className='owner-picture' src="" alt="" />
                                    <p className='post-owner'><Link to="">Ivan Ivanov</Link></p>
                                </div>
                                <div className='commented-on'>Posted on today</div>
                            </div>
                            <div className='post-text'>I agree!</div>
                            <div className='button-div'>
                                <div>
                                </div>
                                <div className='owner-buttons'>
                                    <button className='button' type="button">Edit</button>
                                    <button className='button delete-btn' type="button">Delete</button>
                                </div>
                            </div>
                        </li >
                        <li className='comment-item'>
                            <div className='post-header'>
                                <div>
                                    <img className='owner-picture' src="" alt="" />
                                    <p className='post-owner'><Link to="">Ivan Ivanov</Link></p>
                                </div>
                                <div className='commented-on'>Posted on today</div>
                            </div>
                            <div className='post-text'>I agree!</div>
                            <div className='button-div'>
                                <div>
                                </div>
                                <div className='owner-buttons'>
                                    <button className='button' type="button">Edit</button>
                                    <button className='button delete-btn' type="button">Delete</button>
                                </div>
                            </div>
                        </li >
                        <li className='comment-item'>
                            <div className='post-header'>
                                <div>
                                    <img className='owner-picture' src="" alt="" />
                                    <p className='post-owner'><Link to="">Ivan Ivanov</Link></p>
                                </div>
                                <div className='commented-on'>Posted on today</div>
                            </div>
                            <div className='post-text'>I agree!</div>
                            <div className='button-div'>
                                <div>
                                </div>
                                <div className='owner-buttons'>
                                    <button className='button' type="button">Edit</button>
                                    <button className='button delete-btn' type="button">Delete</button>
                                </div>
                            </div>
                        </li >
                        <li className='comment-item'>
                            <div className='post-header'>
                                <div>
                                    <img className='owner-picture' src="" alt="" />
                                    <p className='post-owner'><Link to="">Ivan Ivanov</Link></p>
                                </div>
                                <div className='commented-on'>Posted on today</div>
                            </div>
                            <div className='post-text'>I agree!</div>
                            <div className='button-div'>
                                <div>
                                </div>
                                <div className='owner-buttons'>
                                    <button className='button' type="button">Edit</button>
                                    <button className='button delete-btn' type="button">Delete</button>
                                </div>
                            </div>
                        </li >
                        <li className='comment-item'>
                            <div className='post-header'>
                                <div>
                                    <img className='owner-picture' src="" alt="" />
                                    <p className='post-owner'><Link to="">Ivan Ivanov</Link></p>
                                </div>
                                <div className='commented-on'>Posted on today</div>
                            </div>
                            <div className='post-text'>I agree!</div>
                            <div className='button-div'>
                                <div>
                                </div>
                                <div className='owner-buttons'>
                                    <button className='button' type="button">Edit</button>
                                    <button className='button delete-btn' type="button">Delete</button>
                                </div>
                            </div>
                        </li >
                        <li className='comment-item'>
                            <div className='post-header'>
                                <div>
                                    <img className='owner-picture' src="" alt="" />
                                    <p className='post-owner'><Link to="">Ivan Ivanov</Link></p>
                                </div>
                                <div className='commented-on'>Posted on today</div>
                            </div>
                            <div className='post-text'>I agree!</div>
                            <div className='button-div'>
                                <div>
                                </div>
                                <div className='owner-buttons'>
                                    <button className='button' type="button">Edit</button>
                                    <button className='button delete-btn' type="button">Delete</button>
                                </div>
                            </div>
                        </li >
                        <li className='comment-item'>
                            <div className='post-header'>
                                <div>
                                    <img className='owner-picture' src="" alt="" />
                                    <p className='post-owner'><Link to="">Ivan Ivanov</Link></p>
                                </div>
                                <div className='commented-on'>Posted on today</div>
                            </div>
                            <div className='post-text'>I agree!</div>
                            <div className='button-div'>
                                <div>
                                </div>
                                <div className='owner-buttons'>
                                    <button className='button' type="button">Edit</button>
                                    <button className='button delete-btn' type="button">Delete</button>
                                </div>
                            </div>
                        </li >
                        <li className='comment-item'>
                            <div className='post-header'>
                                <div>
                                    <img className='owner-picture' src="" alt="" />
                                    <p className='post-owner'><Link to="">Ivan Ivanov</Link></p>
                                </div>
                                <div className='commented-on'>Posted on today</div>
                            </div>
                            <div className='post-text'>I agree!</div>
                            <div className='button-div'>
                                <div>
                                </div>
                                <div className='owner-buttons'>
                                    <button className='button' type="button">Edit</button>
                                    <button className='button delete-btn' type="button">Delete</button>
                                </div>
                            </div>
                        </li >
                        <li className='comment-item'>
                            <div className='post-header'>
                                <div>
                                    <img className='owner-picture' src="" alt="" />
                                    <p className='post-owner'><Link to="">Ivan Ivanov</Link></p>
                                </div>
                                <div className='commented-on'>Posted on today</div>
                            </div>
                            <div className='post-text'>I agree!</div>
                            <div className='button-div'>
                                <div>
                                </div>
                                <div className='owner-buttons'>
                                    <button className='button' type="button">Edit</button>
                                    <button className='button delete-btn' type="button">Delete</button>
                                </div>
                            </div>
                        </li >
                        <li className='comment-item'>
                            <div className='post-header'>
                                <div>
                                    <img className='owner-picture' src="" alt="" />
                                    <p className='post-owner'><Link to="">Ivan Ivanov</Link></p>
                                </div>
                                <div className='commented-on'>Posted on today</div>
                            </div>
                            <div className='post-text'>I agree!</div>
                            <div className='button-div'>
                                <div>
                                </div>
                                <div className='owner-buttons'>
                                    <button className='button' type="button">Edit</button>
                                    <button className='button delete-btn' type="button">Delete</button>
                                </div>
                            </div>
                        </li >
                        <li className='comment-item'>
                            <div className='post-header'>
                                <div>
                                    <img className='owner-picture' src="" alt="" />
                                    <p className='post-owner'><Link to="">Ivan Ivanov</Link></p>
                                </div>
                                <div className='commented-on'>Posted on today</div>
                            </div>
                            <div className='post-text'>I agree!</div>
                            <div className='button-div'>
                                <div>
                                </div>
                                <div className='owner-buttons'>
                                    <button className='button' type="button">Edit</button>
                                    <button className='button delete-btn' type="button">Delete</button>
                                </div>
                            </div>
                        </li >
                        <li className='comment-item'>
                            <div className='post-header'>
                                <div>
                                    <img className='owner-picture' src="" alt="" />
                                    <p className='post-owner'><Link to="">Ivan Ivanov</Link></p>
                                </div>
                                <div className='commented-on'>Posted on today</div>
                            </div>
                            <div className='post-text'>I agree!</div>
                            <div className='button-div'>
                                <div>
                                </div>
                                <div className='owner-buttons'>
                                    <button className='button' type="button">Edit</button>
                                    <button className='button delete-btn' type="button">Delete</button>
                                </div>
                            </div>
                        </li >
                        <li className='comment-item'>
                            <div className='post-header'>
                                <div>
                                    <img className='owner-picture' src="" alt="" />
                                    <p className='post-owner'><Link to="">Ivan Ivanov</Link></p>
                                </div>
                                <div className='commented-on'>Posted on today</div>
                            </div>
                            <div className='post-text'>I agree!</div>
                            <div className='button-div'>
                                <div>
                                </div>
                                <div className='owner-buttons'>
                                    <button className='button' type="button">Edit</button>
                                    <button className='button delete-btn' type="button">Delete</button>
                                </div>
                            </div>
                        </li >
                        <li className='comment-item'>
                            <div className='post-header'>
                                <div>
                                    <img className='owner-picture' src="" alt="" />
                                    <p className='post-owner'><Link to="">Ivan Ivanov</Link></p>
                                </div>
                                <div className='commented-on'>Posted on today</div>
                            </div>
                            <div className='post-text'>I agree!</div>
                            <div className='button-div'>
                                <div>
                                </div>
                                <div className='owner-buttons'>
                                    <button className='button' type="button">Edit</button>
                                    <button className='button delete-btn' type="button">Delete</button>
                                </div>
                            </div>
                        </li >
                        <li className='comment-item'>
                            <div className='post-header'>
                                <div>
                                    <img className='owner-picture' src="" alt="" />
                                    <p className='post-owner'><Link to="">Ivan Ivanov</Link></p>
                                </div>
                                <div className='commented-on'>Posted on today</div>
                            </div>
                            <div className='post-text'>I agree!</div>
                            <div className='button-div'>
                                <div>
                                </div>
                                <div className='owner-buttons'>
                                    <button className='button' type="button">Edit</button>
                                    <button className='button delete-btn' type="button">Delete</button>
                                </div>
                            </div>
                        </li >
                        <li className='comment-item'>
                            <div className='post-header'>
                                <div>
                                    <img className='owner-picture' src="" alt="" />
                                    <p className='post-owner'><Link to="">Ivan Ivanov</Link></p>
                                </div>
                                <div className='commented-on'>Posted on today</div>
                            </div>
                            <div className='post-text'>I agree!</div>
                            <div className='button-div'>
                                <div>
                                </div>
                                <div className='owner-buttons'>
                                    <button className='button' type="button">Edit</button>
                                    <button className='button delete-btn' type="button">Delete</button>
                                </div>
                            </div>
                        </li >
                        <li className='comment-item'>
                            <div className='post-header'>
                                <div>
                                    <img className='owner-picture' src="" alt="" />
                                    <p className='post-owner'><Link to="">Ivan Ivanov</Link></p>
                                </div>
                                <div className='commented-on'>Posted on today</div>
                            </div>
                            <div className='post-text'>I agree!</div>
                            <div className='button-div'>
                                <div>
                                </div>
                                <div className='owner-buttons'>
                                    <button className='button' type="button">Edit</button>
                                    <button className='button delete-btn' type="button">Delete</button>
                                </div>
                            </div>
                        </li >
                        <li className='comment-item'>
                            <div className='post-header'>
                                <div>
                                    <img className='owner-picture' src="" alt="" />
                                    <p className='post-owner'><Link to="">Ivan Ivanov</Link></p>
                                </div>
                                <div className='commented-on'>Posted on today</div>
                            </div>
                            <div className='post-text'>I agree!</div>
                            <div className='button-div'>
                                <div>
                                </div>
                                <div className='owner-buttons'>
                                    <button className='button' type="button">Edit</button>
                                    <button className='button delete-btn' type="button">Delete</button>
                                </div>
                            </div>
                        </li >
                        <li className='comment-item'>
                            <div className='post-header'>
                                <div>
                                    <img className='owner-picture' src="" alt="" />
                                    <p className='post-owner'><Link to="">Ivan Ivanov</Link></p>
                                </div>
                                <div className='commented-on'>Posted on today</div>
                            </div>
                            <div className='post-text'>I agree!</div>
                            <div className='button-div'>
                                <div>
                                </div>
                                <div className='owner-buttons'>
                                    <button className='button' type="button">Edit</button>
                                    <button className='button delete-btn' type="button">Delete</button>
                                </div>
                            </div>
                        </li >
                    </ul>
                </div>
            </div>
        </li >
    </>
}