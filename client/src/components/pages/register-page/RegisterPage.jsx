import { useActionState, useContext } from "react";

import userServices from "../../../services/user-services";

import { UserContext } from "../../../contexts/user-context";

import AuthButton from "../../shared/auth/auth-button/AuthButton";
import AuthForm from "../../shared/auth/auth-form/AuthForm";
import AuthNavLink from "../../shared/auth/auth-nav-link/AuthNavLink";
import GenderDetails from "../../ui/inputs/gender-details/GenderDetails";
import { AlertContext } from "../../../contexts/alert-context";

export default function RegisterPage() {
    const registerFields = [
        { fieldName: 'First name', inputType: 'text', placeholderText: 'first name', inputName: 'firstName' },
        { fieldName: 'Last name', inputType: 'text', placeholderText: 'last name', inputName: 'lastName' },
        { fieldName: 'Email', inputType: 'email', placeholderText: 'email', inputName: 'email' },
        { fieldName: 'Birthday', inputType: 'date', placeholderText: 'birthday', inputName: 'birthday' },
        { fieldName: 'Password', inputType: 'password', placeholderText: 'password', inputName: 'password' },
        { fieldName: 'Confirm Password', inputType: 'password', placeholderText: 'password', inputName: 'rePass' },
    ]

    const { setIsUser } = useContext(UserContext);
    const { setAlert } = useContext(AlertContext);

    const submitFormClickHandler = async (_, formData) => {
        const data = Object.fromEntries(formData);

        await userServices.handleRegister(data, { setIsUser, setAlert });
    }

    const [, action, isPending] = useActionState(submitFormClickHandler);

    return <>
        <div className='register-page'>
            <div className="container">

                <div className="title">Registration</div>
                <div className="content">

                    <form action={action}>
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
                            isPending={isPending}
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