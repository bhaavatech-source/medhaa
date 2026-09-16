import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConsentCheckbox } from './ConsentCheckbox';

describe('ConsentCheckbox', () => {
  it('renders unchecked by default and reflects the checked prop', () => {
    render(<ConsentCheckbox checked={false} onChange={() => {}} />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('calls onChange with the new checked state when clicked', () => {
    const onChange = vi.fn();
    render(<ConsentCheckbox checked={false} onChange={onChange} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('links to the usage policy page', () => {
    render(<ConsentCheckbox checked={false} onChange={() => {}} />);
    expect(screen.getByRole('link', { name: /usage policy/i })).toHaveAttribute('href', '/usage-policy');
  });
});
