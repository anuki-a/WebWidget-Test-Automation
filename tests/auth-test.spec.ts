import { test, request } from '@playwright/test';
import { AuthService } from '../src/api/AuthService';

test.describe('Authentication Service', () => {
  test('should authenticate and acquire token', async () => {
    console.log('Testing authentication service...');
    
    // Create API request context
    const apiRequestContext = await request.newContext({
      baseURL: process.env.API_URL,
    });

    try {
      // Initialize and authenticate
      const authService = AuthService.getInstance();
      await authService.initialize(apiRequestContext);
      
      const token = await authService.authenticate();
      
      // Verify token was acquired
      console.log(`Token acquired successfully. Length: ${token.length} characters`);
      console.log(`Token starts with: ${token.substring(0, 20)}...`);
      
      // Verify token is stored in environment variable
      const storedToken = process.env.API_TOKEN;
      console.log(`Token stored in process.env.API_TOKEN: ${storedToken ? 'Yes' : 'No'}`);
      
      if (storedToken !== token) {
        throw new Error('Token not properly stored in environment variable');
      }
      
      console.log('Authentication test passed!');
      
    } finally {
      await apiRequestContext.dispose();
    }
  });
});
