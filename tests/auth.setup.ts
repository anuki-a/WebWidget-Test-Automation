import { chromium, FullConfig, request } from '@playwright/test';
import { AuthService } from '../src/api/AuthService';

async function globalSetup(config: FullConfig) {
  console.log('Global setup started...');
  
  try {
    // Create API request context for authentication
    const apiRequestContext = await request.newContext({
      baseURL: process.env.API_URL,
    });

    // Initialize and authenticate using AuthService
    const authService = AuthService.getInstance();
    await authService.initialize(apiRequestContext);
    
    // Authenticate and acquire token
    const token = await authService.authenticate();
    console.log(`Token acquired successfully. Length: ${token.length} characters`);

    // Clean up request context
    await apiRequestContext.dispose();
    
    console.log('Global setup completed successfully');
  } catch (error) {
    console.error('Global setup failed:', error);
    throw error; // Re-throw to fail the test suite if authentication fails
  }
}

export default globalSetup;
