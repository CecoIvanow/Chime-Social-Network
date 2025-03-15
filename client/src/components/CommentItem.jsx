import { Link } from "react-router"

export default function CommentItem() {
    return <>
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
    </>
}