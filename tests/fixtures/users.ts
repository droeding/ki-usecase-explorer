/**
 * Static User Fixtures for Testing
 * Provides consistent, predefined user data for test scenarios
 */

export interface UserFixture {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export const userFixtures: UserFixture[] = [
  {
    id: 'user-admin-001',
    email: 'admin@bechtle.com',
    name: 'Admin User',
    createdAt: new Date('2025-01-01T10:00:00Z')
  },
  {
    id: 'user-analyst-001',
    email: 'analyst@bechtle.com', 
    name: 'Business Analyst',
    createdAt: new Date('2025-01-02T10:00:00Z')
  },
  {
    id: 'user-consultant-001',
    email: 'consultant@bechtle.com',
    name: 'IT Consultant',
    createdAt: new Date('2025-01-03T10:00:00Z')
  },
  {
    id: 'user-manager-001',
    email: 'manager@bechtle.com',
    name: 'Project Manager',
    createdAt: new Date('2025-01-04T10:00:00Z')
  },
  {
    id: 'user-developer-001',
    email: 'developer@bechtle.com',
    name: 'Software Developer',
    createdAt: new Date('2025-01-05T10:00:00Z')
  }
];

// Utility functions for accessing specific users
export const getAdminUser = () => userFixtures[0];
export const getAnalystUser = () => userFixtures[1];
export const getConsultantUser = () => userFixtures[2];
export const getManagerUser = () => userFixtures[3];
export const getDeveloperUser = () => userFixtures[4];

// Get user by role for testing
export const getUserByRole = (role: 'admin' | 'analyst' | 'consultant' | 'manager' | 'developer'): UserFixture => {
  const userMap = {
    admin: getAdminUser(),
    analyst: getAnalystUser(),
    consultant: getConsultantUser(),
    manager: getManagerUser(),
    developer: getDeveloperUser()
  };
  return userMap[role];
};
