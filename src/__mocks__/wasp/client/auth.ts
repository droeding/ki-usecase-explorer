// Mock for wasp/client/auth
export const useAuth = jest.fn(() => ({
  data: null,
  isLoading: false,
  error: null
}));

export const LoginForm = jest.fn(() => 'Login Form');
export const SignupForm = jest.fn(() => 'Signup Form');
