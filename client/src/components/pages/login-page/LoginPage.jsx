import { Link } from "react-router";
import userServices from "../../../services/user-services";

export default function LoginPage({
    setIsUser
}) {

    const submitFormHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);

        await userServices.handleLogin(data, setIsUser);
    }

    return <>
        <div className="login-page">
            <div className="container">
                {/* <!-- Title section --> */}
                <div className="title">Login</div>
                <div className="content">
                    {/* <!-- Registration form --> */}
                    <form onSubmit={submitFormHandler}>
                        <div className="user-details">
                            {/* <!-- Input for Email --> */}
                            <div className="input-box">
                                <span className="details">Email</span>
                                <input type="text" placeholder="Enter your email" name="email" required />
                            </div>
                            {/* <!-- Input for Password --> */}
                            <div className="input-box">
                                <span className="details">Password</span>
                                <input type="password" placeholder="Enter your password" name="password" required />
                            </div>
                        </div>
                        {/* <!-- Submit button --> */}
                        <div className="button-auth">
                            <input type="submit" value="Login" />
                        </div>
                        <div className='to-register'>
                            <Link to="/register">Don`t have an account?</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>
}