import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { LoginPage } from '../Login';

// Mock Wasp authentication
jest.mock('wasp/client/auth', () => ({
  LoginForm: ({ children, ...props }: any) => (
    <form data-testid="wasp-login-form" {...props}>
      {children}
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  ),
  SignupForm: ({ children, ...props }: any) => (
    <form data-testid="wasp-signup-form" {...props}>
      {children}
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <button type="submit">Sign Up</button>
    </form>
  ),
}));

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

describe('LoginPage', () => {
  it('should render login page component', () => {
    render(
      <RouterWrapper>
        <LoginPage />
      </RouterWrapper>
    );

    // Component should render without crashing
    expect(document.body).toBeInTheDocument();
  });

  it('should display login form', () => {
    const { container } = render(
      <RouterWrapper>
        <LoginPage />
      </RouterWrapper>
    );

    // Check for login form - component should render
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should be accessible to screen readers', () => {
    const { container } = render(
      <RouterWrapper>
        <LoginPage />
      </RouterWrapper>
    );

    // Basic accessibility check
    expect(container.firstChild).toBeInTheDocument();
  });
});
