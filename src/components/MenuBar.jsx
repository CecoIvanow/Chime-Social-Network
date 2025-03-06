
        export default function MenuBar() {
            return <>
            <nav>
                <div className="navbar">
                <div className="logo"><a href="#Home">CodingLab</a></div>
                    <ul className="menu">
                        <li><a href="#Home" title='Home'><img src="src\static\images\home-icon.png" alt="Home" /></a></li>
                        <li><a href="#Profile" title='Profile'><img src="src\static\images\profile-icon.png" alt="Profile" /></a></li>
                        <li><a href="#Catalog" title='Catalog'><img src="src\static\images\catalog-icon.png" alt="Catalog" /></a></li>
                        <li><a href="#Notifications" title='Notifications'><img src="src\static\images\notifications-icon.png" alt="Notifications" /></a></li>
                        <li><a href="#Messages" title='Messages'><img src="src\static\images\messages-icon.png" alt="Messages" /></a></li>
                    </ul>
                    <ul className='auth-menu'>
                        {/* <li><a href="#Login" title="Login">Register</a></li> */}
                        {/* <li><a href="#Register" title="Register">Login</a></li> */}
                        <li><a href="#Settings" title='Settings'><img src="src\static\images\settings-icon.png" alt="Catalog" /></a></li>
                        <li><a href="#Logout" title='Logout'><img src="src\static\images\logout-icon.png" alt="Notifications" /></a></li>
                    </ul>
                </div>
            </nav>
            </>
        }