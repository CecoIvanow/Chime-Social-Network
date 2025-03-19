import userServices from "../../../services/user-services";

import AuthButton from "../../shared/auth-button/AuthButton";
import AuthForm from "../../shared/auth-form/AuthForm";
import AuthNavLink from "../../shared/auth-nav-link/AuthNavLink";

export default function LoginPage({
    setIsUser
}) {

    const loginFields = [
        { fieldName: 'Email', inputType: 'email', placeholderText: 'email', inputName: 'email' },
        { fieldName: 'Password', inputType: 'password', placeholderText: 'password', inputName: 'password' }
    ]

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

                            {loginFields.map(field =>
                                <AuthForm
                                    key={field.fieldName}
                                    fieldName={field.fieldName}
                                    inputName={field.inputName}
                                    inputType={field.inputType}
                                    placeholderText={field.placeholderText}
                                />
                            )}

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