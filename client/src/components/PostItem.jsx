export default function PostItem() {
    return <>
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
    </>
}