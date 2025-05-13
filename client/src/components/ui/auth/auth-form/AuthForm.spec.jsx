import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AuthForm from "./AuthForm";

describe('AuthForm component', () => {
    it('renders with input-box container, details, label and input', () => {
        render(
            <AuthForm
                fieldName='Email'
                placeholderText='email'
            />
        );

        const container = screen.getByTestId('auth-input-box');
        const details = screen.getByText('Email');
        const label = screen.getByTestId('auth-input-label');
        const input = screen.getByPlaceholderText('Enter your email');

        expect(container).toBeInTheDocument();

        expect(details).toBeInTheDocument();
        expect(details).toHaveTextContent('Email');

        expect(label).toBeInTheDocument();

        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('placeholder', 'Enter your email');
    });

    it('renders with passed props', () => {
        render(
            <AuthForm
                fieldName='Username'
                inputName='username'
                inputType='text'
                placeholderText='username'
            />
        )

        const details = screen.getByText('Username');
        const label = screen.getByTestId('auth-input-label');
        const input = screen.getByPlaceholderText('Enter your username');

        expect(details).toBeInTheDocument();
        expect(details).toHaveTextContent('Username');

        expect(label).toBeInTheDocument();
        expect(label).toHaveAttribute('for', 'username');

        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('id', 'username');
        expect(input).toHaveAttribute('name', 'username');
        expect(input).toHaveAttribute('type', 'text');
        expect(input).toHaveAttribute('placeholder', 'Enter your username');
    });

    it('links label and input correctly via htmlFor and id', () => {
        render(
            <AuthForm
                inputName='pass'
                placeholderText='password'
            />
        );

        const label = screen.getByTestId('auth-input-label');
        const input = screen.getByPlaceholderText('Enter your password');

        expect(label).toHaveAttribute('for', 'pass');

        expect(input).toHaveAttribute('id', 'pass');
    });

    it("renders input with 'required' attribute", () => {
        render(
            <AuthForm
                placeholderText='email'
            />
        );

        const input = screen.getByPlaceholderText('Enter your email');

        expect(input).toBeInTheDocument();
        expect(input).toBeRequired();;
    });

    it('renders with correct input value on change', () => {
        render(
            <AuthForm
                placeholderText='password'
            />
        );

        const input = screen.getByPlaceholderText('Enter your password');

        fireEvent.change(input, { target: { value: '123' } });
        expect(input).toHaveValue('123');

        fireEvent.change(input, { target: { value: '123456' } });
        expect(input).toHaveValue('123456');
    });

    it('rerenders with default input value', () => {
        const { rerender } = render(
            <AuthForm
                placeholderText='password'
            />
        );

        const input = screen.getByPlaceholderText('Enter your password');

        fireEvent.change(input, { target: { value: '123' } });
        expect(input).toHaveValue('123');

        fireEvent.change(input, { target: { value: '123456' } });
        expect(input).toHaveValue('123456');

        rerender(
            <AuthForm
                placeholderText='password'
            />
        )

        expect(input).toHaveValue('123456');
    });
});