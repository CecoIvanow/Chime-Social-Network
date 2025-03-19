import userServices from "../../../services/user-services";

import AuthButton from "../../shared/auth-button/AuthButton";
import AuthNavLink from "../../shared/auth-nav-link/AuthNavLink";

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

                <div className="title">Login</div>
                <div className="content">

                    <form onSubmit={submitFormHandler}>
                        <div className="user-details">

                            <div className="input-box">
                                <span className="details">Email</span>
                                <input type="text" placeholder="Enter your email" name="email" required />
                            </div>

                            <div className="input-box">
                                <span className="details">Password</span>
                                <input type="password" placeholder="Enter your password" name="password" required />
                            </div>
                        </div>

                        <AuthButton
                            buttonText="Login"
                        />
                        <AuthNavLink
                            path="/register"
                            buttonText="Don`t have an account?"
                        />
                    </form>
                </div>
            </div>
        </div>
    </>
}