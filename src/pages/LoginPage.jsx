
export default function LoginPage() {
    return <>
        <div className="login-page">
            <div className="container">
                {/* <!-- Title section --> */}
                <div className="title">Login</div>
                <div className="content">
                    {/* <!-- Registration form --> */}
                    <form action="#">
                        <div className="user-details">
                            {/* <!-- Input for Email --> */}
                            <div className="input-box">
                                <span className="details">Email</span>
                                <input type="text" placeholder="Enter your email" required />
                            </div>
                            {/* <!-- Input for Password --> */}
                            <div className="input-box">
                                <span className="details">Password</span>
                                <input type="text" placeholder="Enter your password" required />
                            </div>
                        </div>
                        {/* <!-- Submit button --> */}
                        <div className="button">
                            <input type="submit" value="Login" />
                        </div>
                        <div className='to-register'>
                            <a href="#Login">Don`t have an account?</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>
}