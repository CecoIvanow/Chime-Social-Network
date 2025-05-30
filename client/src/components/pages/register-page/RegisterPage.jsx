import { useActionState, useContext, useEffect } from "react";

import AuthButton from "../../ui/auth/auth-button/AuthButton";
import AuthNavLink from "../../ui/auth/auth-nav-link/AuthNavLink";
import GenderDetails from "../../shared/user-details/gender-details/GenderDetails";
import AuthHeaderTitle from "../../shared/auth/auth-header-title/AuthHeaderTitle";
import AuthFormsList from "../../shared/auth/auth-forms-list/AuthFormsList";

import { AlertContext } from "../../../contexts/alert-context";

import useUserServices from "../../../hooks/useUserServices";

export default function RegisterPage() {
    const registerFields = [
        { fieldName: 'First name', inputType: 'text', placeholderText: 'first name', inputName: 'firstName' },
        { fieldName: 'Last name', inputType: 'text', placeholderText: 'last name', inputName: 'lastName' },
        { fieldName: 'Email', inputType: 'email', placeholderText: 'email', inputName: 'email' },
        { fieldName: 'Birthday', inputType: 'date', placeholderText: 'birthday', inputName: 'birthday' },
        { fieldName: 'Password', inputType: 'password', placeholderText: 'password', inputName: 'password' },
        { fieldName: 'Confirm Password', inputType: 'password', placeholderText: 'password', inputName: 'rePass' },
    ]

    const { setAlert } = useContext(AlertContext);

    const { register, abortAll } = useUserServices();

    const submitFormClickHandler = async (_, formData) => {
        const data = Object.fromEntries(formData);

        try {
            await register(data);
        } catch (error) {
            console.error(error);
            setAlert(error.message);
        }
    }

    const [, action, isPending] = useActionState(submitFormClickHandler);

    useEffect(() => {
        return () => {
            abortAll();
        }
    }, [abortAll]);

    return <>
        <div className='register-page'>
            <div className="container">

                <AuthHeaderTitle
                    title='Register'
                />

                <div className="content">

                    <form action={action}>

                        <AuthFormsList
                            authFieldsList={registerFields}
                        />

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