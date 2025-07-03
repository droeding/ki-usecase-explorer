// Mock for wasp/client/operations
export const useQuery = jest.fn(() => ({
  data: null,
  isLoading: false,
  error: null,
  refetch: jest.fn()
}));

export const useAction = jest.fn(() => 
  jest.fn().mockResolvedValue({ success: true })
);
