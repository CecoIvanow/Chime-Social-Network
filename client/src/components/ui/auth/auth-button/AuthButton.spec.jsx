import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import AuthButton from './AuthButton';

describe('AuthButton component', () => {
    it('renders a submit button with the correct text and container', () => {
        render(<AuthButton
            buttonText='Login'
        />);

        expect(screen.getByRole('button')).toHaveValue('Login');
    });

    it('isPending is false by default', () => {
        render(<AuthButton
            buttonText='Login'
        />);

        expect(screen.getByRole('button')).not.toBeDisabled();
    })

    it('is disabled if isPending is true', () => {
        render(<AuthButton
            buttonText='Loading...'
            isPending={true}
        />);

        expect(screen.getByRole('button')).toBeDisabled();
    })
})