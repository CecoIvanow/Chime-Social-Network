import '../static/styles/RegisterPage.css'

export default function RegisterPage() {
    return <>
        <div className="container">
            {/* <!-- Title section --> */}
            <div className="title">Registration</div>
            <div className="content">
                {/* <!-- Registration form --> */}
                <form action="#">
                    <div className="user-details">
                        {/* <!-- Input for Full Name --> */}
                        <div className="input-box">
                            <span className="details">Full Name</span>
                            <input type="text" placeholder="Enter your name" required />
                        </div>
                        {/* <!-- Input for Username --> */}
                        <div className="input-box">
                            <span className="details">Username</span>
                            <input type="text" placeholder="Enter your username" required />
                        </div>
                        {/* <!-- Input for Email --> */}
                        <div className="input-box">
                            <span className="details">Email</span>
                            <input type="text" placeholder="Enter your email" required />
                        </div>
                        {/* <!-- Input for Phone Number --> */}
                        <div className="input-box">
                            <span className="details">Phone Number</span>
                            <input type="text" placeholder="Enter your number" required />
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
                        <input type="radio" name="gender" id="dot-3" />
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
                            {/* <!-- Label for Prefer not to say --> */}
                            <label htmlFor="dot-3">
                                <span className="dot three"></span>
                                <span className="gender">Prefer not to say</span>
                            </label>
                        </div>
                    </div>
                    {/* <!-- Submit button --> */}
                    <div className="button">
                        <input type="submit" value="Register" />
                    </div>
                </form>
            </div>
        </div>
    </>
}