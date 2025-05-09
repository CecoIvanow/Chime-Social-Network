import { useActionState, useContext, useEffect } from "react";

import AuthButton from "../../shared/auth/auth-button/AuthButton";
import AuthForm from "../../shared/auth/auth-form/AuthForm";
import AuthNavLink from "../../shared/auth/auth-nav-link/AuthNavLink";

import { AlertContext } from "../../../contexts/alert-context";

import useUserServices from "../../../hooks/useUserServices";

export default function LoginPage() {
    const loginFields = [
        { fieldName: 'Email', inputType: 'email', placeholderText: 'email', inputName: 'email' },
        { fieldName: 'Password', inputType: 'password', placeholderText: 'password', inputName: 'password' }
    ]

    const { setAlert } = useContext(AlertContext);

    const { login, abortAll } = useUserServices();

    const submitFormHandler = async (_, formData) => {
        const data = Object.fromEntries(formData);

        try {
            await login(data);
        } catch (error) {
            console.error(error);
            setAlert(error.message);
        }
    }

    const [, action, isPending] = useActionState(submitFormHandler);

    useEffect(() => {
        return () => {
            abortAll();
        }
    }, [abortAll])

    return <>
        <div className="login-page">
            <div className="container">

                <div className="title">Login</div>
                <div className="content">

                    <form action={action}>
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
                            isPending={isPending}
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