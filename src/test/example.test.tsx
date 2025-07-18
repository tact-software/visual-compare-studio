import { describe, it, expect, vi } from 'vitest';
import { render, screen } from './utils';
import { userEvent } from '@testing-library/user-event';
import { Button } from '@mui/material';

const user = userEvent.setup();

describe('MUI Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies correct variant classes', () => {
    render(<Button variant="contained">Submit</Button>);
    const button = screen.getByText('Submit');
    expect(button).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByText('Click me');
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
