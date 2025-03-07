import { Link } from "react-router";

import userClientApi from "../client-api/user-api.js";

import MenuBar from "../components/MenuBar";

export default function RegisterPage() {

    const submitFormClickHandler = async (e) => {
        e.preventDefault(); 

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);

        await userClientApi.register(data);
    }

    return <>
        <MenuBar />

        <div className='register-page'>
            <div className="container">

                <div className="title">Registration</div>
                <div className="content">

                    <form onSubmit={submitFormClickHandler}>
                        <div className="user-details">

                            <div className="input-box">
                                <span className="details">First name</span>
                                <input type="text" placeholder="Enter your first name" name="firstName"/>
                            </div>
                            <div className="input-box">

                                <span className="details">Last name</span>
                                <input type="text" placeholder="Enter your last name" name="lastName" />
                            </div>

                            <div className="input-box">
                                <span className="details">Email</span>
                                <input type="text" placeholder="Enter your email" name="email" />
                            </div>

                            <div className="input-box">
                                <span className="details">Birthday</span>
                                <input type="text" placeholder="Enter your birthday" name="birthday" />
                            </div>

                            <div className="input-box">
                                <span className="details">Password</span>
                                <input type="text" placeholder="Enter your password" name="password" />
                            </div>

                            <div className="input-box">
                                <span className="details">Confirm Password</span>
                                <input type="text" placeholder="Confirm your password" name="rePass" />
                            </div>
                        </div>
                        <div className="gender-details">
                            <input type="radio" value="Male" name="gender" id="dot-1" />
                            <input type="radio" value="Female" name="gender" id="dot-2" />
                            <span className="gender-title">Gender</span>
                            <div className="category">
                                <label htmlFor="dot-1">
                                    <span className="dot one"></span>
                                    <span className="gender">Male</span>
                                </label>
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
                            <Link to="/login">Already have an account?</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>
}