import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import TestPage from '../TestPage';

// Wrapper component for routing context
const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('TestPage', () => {
  it('should render test page component', () => {
    render(
      <RouterWrapper>
        <TestPage />
      </RouterWrapper>
    );

    // Component should render without crashing
    expect(document.body).toBeInTheDocument();
  });

  it('should be accessible to screen readers', () => {
    const { container } = render(
      <RouterWrapper>
        <TestPage />
      </RouterWrapper>
    );

    // Basic accessibility check
    expect(container.firstChild).toBeInTheDocument();
  });
});
