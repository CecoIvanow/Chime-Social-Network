import userServices from "../../../services/user-services";

import AuthButton from "../../shared/auth-button/AuthButton";
import AuthForm from "../../shared/auth-form/AuthForm";
import AuthNavLink from "../../shared/auth-nav-link/AuthNavLink";
import GenderDetails from "./gender-details/GenderDetails";

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

    const submitFormClickHandler = async (formData) => {
        const data = Object.fromEntries(formData);

        await userServices.handleRegister(data, setIsUser);
    }

    return <>
        <div className='register-page'>
            <div className="container">

                <div className="title">Registration</div>
                <div className="content">

                    <form action={submitFormClickHandler}>
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

                        <GenderDetails />

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