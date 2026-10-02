import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import LoginPricingModal from './LoginPricingModal';

const mocks = vi.hoisted(() => ({ navigate: vi.fn() }));

vi.mock('react-router-dom', () => ({ useNavigate: () => mocks.navigate }));
vi.mock('../pages/hooks/useLoginForm', () => ({
  useLoginForm: () => ({
    email: '', setEmail: vi.fn(), password: '', setPassword: vi.fn(),
    error: '', loading: false, handleSubmit: vi.fn(),
  }),
}));
vi.mock('../utils/apiConfig', () => ({ API_URL: 'https://api.example.test/api' }));

describe('LoginPricingModal', () => {
  beforeEach(() => {
    mocks.navigate.mockClear();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ plans: [
        { id: 'MONTHLY_1', amountPaise: 14900 },
        { id: 'YEARLY_1', amountPaise: 69900 },
      ] }),
    }));
  });

  it('shows API prices and preserves the selected billing period', async () => {
    render(<LoginPricingModal onClose={vi.fn()} />);

    await waitFor(() => expect(document.querySelectorAll('.lpm-plan-price')[0]?.textContent).toContain('₹149'));
    expect(document.querySelectorAll('.lpm-plan-price')[1]?.textContent).toContain('₹699');
    expect(screen.getByText('Save 61%')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: 'Choose Yearly' }));

    expect(mocks.navigate).toHaveBeenCalledWith('/subscribe', { state: { duration: 'yearly' } });
  });
});