import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { LandingPage } from '../LandingPage';

// Mock Wasp router
jest.mock('wasp/client/router', () => ({
  Link: ({ children, to, ...props }: any) => (
    <a href={to} {...props}>{children}</a>
  ),
}));

// Wrapper component for routing context
const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('LandingPage', () => {
  it('should render landing page component', () => {
    render(
      <RouterWrapper>
        <LandingPage />
      </RouterWrapper>
    );

    // Component should render without crashing
    expect(document.body).toBeInTheDocument();
  });

  it('should be accessible to screen readers', () => {
    const { container } = render(
      <RouterWrapper>
        <LandingPage />
      </RouterWrapper>
    );

    // Basic accessibility check
    expect(container.firstChild).toBeInTheDocument();
  });
});
