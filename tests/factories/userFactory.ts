/**
 * Dynamic User Factory for Test Data Generation
 * Creates realistic user data with customizable parameters
 */

export interface UserFactoryOptions {
  id?: string;
  email?: string;
  name?: string;
  createdAt?: Date;
  domain?: string;
}

export interface GeneratedUser {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

// Realistic German/Corporate names for Bechtle context
const firstNames = [
  'Andreas', 'Bernd', 'Christian', 'Daniel', 'Erik', 'Frank', 'Georg', 'Hans',
  'Ingo', 'Jürgen', 'Klaus', 'Lars', 'Martin', 'Norbert', 'Oliver', 'Peter',
  'Richard', 'Stefan', 'Thomas', 'Uwe', 'Volker', 'Werner', 'Xavier', 'Yves', 'Zoran',
  'Anna', 'Birgit', 'Claudia', 'Diana', 'Eva', 'Franziska', 'Gisela', 'Heike',
  'Iris', 'Julia', 'Katrin', 'Lisa', 'Monika', 'Nicole', 'Petra', 'Regina',
  'Sabine', 'Tanja', 'Ulrike', 'Vera', 'Waltraud', 'Yvonne', 'Zara'
];

const lastNames = [
  'Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker',
  'Schulz', 'Hoffmann', 'Koch', 'Richter', 'Klein', 'Wolf', 'Schröder', 'Neumann',
  'Schwarz', 'Zimmermann', 'Braun', 'Krüger', 'Hofmann', 'Hartmann', 'Lange', 'Schmitt',
  'Werner', 'Schmitz', 'Krause', 'Meier', 'Lehmann', 'Huber', 'Mayer', 'Hermann'
];

const departments = [
  'IT', 'Sales', 'Marketing', 'Operations', 'Finance', 'HR', 'Consulting', 
  'Support', 'Development', 'Architecture', 'Security', 'Cloud'
];

let userCounter = 1;

/**
 * Generate a unique user ID
 */
const generateUserId = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `user-${timestamp}-${random}`;
};

/**
 * Generate a realistic name
 */
const generateName = (): string => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
};

/**
 * Generate a corporate email address
 */
const generateEmail = (name?: string, domain: string = 'bechtle.com'): string => {
  if (name) {
    const cleanName = name.toLowerCase()
      .replace('ä', 'ae').replace('ö', 'oe').replace('ü', 'ue').replace('ß', 'ss')
      .replace(/[^a-z\s]/g, '')
      .replace(/\s+/g, '.');
    return `${cleanName}@${domain}`;
  }
  
  const department = departments[Math.floor(Math.random() * departments.length)].toLowerCase();
  const number = Math.floor(Math.random() * 99) + 1;
  return `user.${department}.${number}@${domain}`;
};

/**
 * Generate a random date within the last year
 */
const generateCreatedAt = (): Date => {
  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  const diffMs = now.getTime() - oneYearAgo.getTime();
  const randomMs = Math.floor(Math.random() * diffMs);
  return new Date(oneYearAgo.getTime() + randomMs);
};

/**
 * Create a single user with optional parameters
 */
export const createUser = (options: UserFactoryOptions = {}): GeneratedUser => {
  const name = options.name || generateName();
  const domain = options.domain || 'bechtle.com';
  
  return {
    id: options.id || generateUserId(),
    email: options.email || generateEmail(name, domain),
    name: name,
    createdAt: options.createdAt || generateCreatedAt()
  };
};

/**
 * Create multiple users
 */
export const createUsers = (count: number, baseOptions: UserFactoryOptions = {}): GeneratedUser[] => {
  return Array.from({ length: count }, (_, index) => {
    return createUser({
      ...baseOptions,
      id: baseOptions.id ? `${baseOptions.id}-${index + 1}` : undefined
    });
  });
};

/**
 * Create users with specific roles/departments
 */
export const createUsersByRole = (roles: string[], domain: string = 'bechtle.com'): GeneratedUser[] => {
  return roles.map((role, index) => {
    const name = generateName();
    return createUser({
      email: `${role.toLowerCase()}.${index + 1}@${domain}`,
      name: `${name} (${role})`,
      domain
    });
  });
};

/**
 * Create a test team with predefined roles
 */
export const createTestTeam = (): GeneratedUser[] => {
  const roles = ['Admin', 'Manager', 'Developer', 'Analyst', 'Consultant'];
  return createUsersByRole(roles);
};
