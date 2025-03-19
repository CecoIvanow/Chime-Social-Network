import userServices from "../../../services/user-services";

import AuthButton from "../../shared/auth-button/AuthButton";
import AuthForm from "../../shared/auth-form/AuthForm";
import AuthNavLink from "../../shared/auth-nav-link/AuthNavLink";

export default function RegisterPage({
    setIsUser
}) {

    const registerFields = [
        { fieldName: 'First name', inputType: 'text', placeholderText: 'first name', inputName: 'firstName' },
        { fieldName: 'Last name', inputType: 'text', placeholderText: 'last name', inputName: 'lastName' },
        { fieldName: 'Email', inputType: 'email', placeholderText: 'email', inputName: 'email' },
        { fieldName: 'Birthday', inputType: 'date', placeholderText: 'birthday', inputName: 'birthday' },
        { fieldName: 'Password', inputType: 'password', placeholderText: 'password', inputName: 'password' },
        { fieldName: 'Confirm Password', inputType: 'password', placeholderText: 'password', inputName: 'rePass' },
    ]

    const submitFormClickHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);

        await userServices.handleRegister(data, setIsUser);
    }

    return <>
        <div className='register-page'>
            <div className="container">

                <div className="title">Registration</div>
                <div className="content">

                    <form onSubmit={submitFormClickHandler}>
                        <div className="user-details">

                            {registerFields.map(field =>
                                <AuthForm
                                    key={field.fieldName}
                                    fieldName={field.fieldName}
                                    inputName={field.inputName}
                                    inputType={field.inputType}
                                    placeholderText={field.placeholderText}
                                />
                            )}

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

                        <AuthButton
                            buttonText="Register"
                        />
                        <AuthNavLink
                            path="/login"
                            buttonText="Already have an account?"
                        />
                    </form>
                </div>
            </div>
        </div>
    </>
}