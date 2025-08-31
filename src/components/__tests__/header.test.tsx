import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Header } from '../header';
import { useTracking } from '@/telemetry/tracking';

jest.mock('@/telemetry/tracking', () => ({
  useTracking: jest.fn(),
}));

describe('Header', () => {
  beforeEach(() => {
    (useTracking as jest.Mock).mockReturnValue({
      trackEvent: jest.fn(),
      getSessionId: jest.fn().mockReturnValue('session'),
      getUserId: jest.fn().mockReturnValue('user'),
    });
  });

  it('renders navigation links', () => {
    render(<Header />);
    expect(screen.getByText(/Features/i)).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Header />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
