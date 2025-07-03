import React from 'react';

// Mock Wasp Router
export const Link = ({ children, to, ...props }: any) => 
  React.createElement('a', { href: to, ...props }, children);
