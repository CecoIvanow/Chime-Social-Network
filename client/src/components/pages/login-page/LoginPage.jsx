import { useActionState, useContext, useEffect } from "react";

import AuthButton from "../../ui/auth/auth-button/AuthButton";
import AuthFormsList from "../../shared/auth/auth-forms-list/AuthFormsList";
import AuthHeaderTitle from "../../shared/auth/auth-header-title/AuthHeaderTitle";
import AuthNavLink from "../../ui/auth/auth-nav-link/AuthNavLink";

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

                <AuthHeaderTitle
                    title='Login'
                />

                <div className="content">

                    <form action={action}>

                        <AuthFormsList authFieldsList={loginFields} />

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