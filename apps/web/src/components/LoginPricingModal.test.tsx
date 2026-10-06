import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import LoginPricingModal from './LoginPricingModal';

const mocks = vi.hoisted(() => ({ navigate: vi.fn() }));

vi.mock('react-router-dom', () => ({ useNavigate: () => mocks.navigate }));

describe('LoginPricingModal', () => {
  beforeEach(() => {
    mocks.navigate.mockClear();
  });

  it('routes login and pricing to their full pages without embedding forms or plans', () => {
    const onClose = vi.fn();
    render(<LoginPricingModal onClose={onClose} />);

    expect(screen.getByRole('dialog', { name: 'Keep playing' })).toBeInTheDocument();
    expect(screen.queryByLabelText('Email')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Password')).not.toBeInTheDocument();
    expect(screen.queryByText(/Price unavailable|Choose Monthly|Choose Yearly/)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Log in' }));

    expect(onClose).toHaveBeenCalledOnce();
    expect(mocks.navigate).toHaveBeenCalledWith('/login/student');

    onClose.mockClear();
    mocks.navigate.mockClear();
    fireEvent.click(screen.getByRole('button', { name: 'Plans and pricing' }));

    expect(onClose).toHaveBeenCalledOnce();
    expect(mocks.navigate).toHaveBeenCalledWith('/subscribe');
  });
});