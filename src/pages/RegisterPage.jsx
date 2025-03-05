import '../static/styles/SignupSignin.css'

export default function RegisterPage() {
    return <>
        <div className='register-page'>
            <div className="container">
                {/* <!-- Title section --> */}
                <div className="title">Registration</div>
                <div className="content">
                    {/* <!-- Registration form --> */}
                    <form action="#">
                        <div className="user-details">
                            {/* <!-- Input for Full Name --> */}
                            <div className="input-box">
                                <span className="details">First name</span>
                                <input type="text" placeholder="Enter your first name" required />
                            </div>
                            {/* <!-- Input for Username --> */}
                            <div className="input-box">
                                <span className="details">Last name</span>
                                <input type="text" placeholder="Enter your last name" required />
                            </div>
                            {/* <!-- Input for Email --> */}
                            <div className="input-box">
                                <span className="details">Email</span>
                                <input type="text" placeholder="Enter your email" required />
                            </div>
                            {/* <!-- Input for Phone Number --> */}
                            <div className="input-box">
                                <span className="details">Birth place</span>
                                <input type="text" placeholder="Enter your birth place" required />
                            </div>
                            {/* <!-- Input for Password --> */}
                            <div className="input-box">
                                <span className="details">Password</span>
                                <input type="text" placeholder="Enter your password" required />
                            </div>
                            {/* <!-- Input for Confirm Password --> */}
                            <div className="input-box">
                                <span className="details">Confirm Password</span>
                                <input type="text" placeholder="Confirm your password" required />
                            </div>
                        </div>
                        <div className="gender-details">
                            {/* <!-- Radio buttons for gender selection --> */}
                            <input type="radio" name="gender" id="dot-1" />
                            <input type="radio" name="gender" id="dot-2" />
                            <span className="gender-title">Gender</span>
                            <div className="category">
                                {/* <!-- Label for Male --> */}
                                <label htmlFor="dot-1">
                                    <span className="dot one"></span>
                                    <span className="gender">Male</span>
                                </label>
                                {/* <!-- Label for Female --> */}
                                <label htmlFor="dot-2">
                                    <span className="dot two"></span>
                                    <span className="gender">Female</span>
                                </label>
                            </div>
                        </div>
                        {/* <!-- Submit button --> */}
                        <div className="button">
                            <input type="submit" value="Register" />
                        </div>
                        <div className='to-login'>
                            <a href="#Login">Already have an account?</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>
}