import { APIRequestContext, request } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Authentication service for managing dynamic token acquisition.
 * Implements singleton pattern to ensure single token instance across test suite.
 */
export class AuthService {
  private static instance: AuthService;
  private token: string | null = null;
  private request: APIRequestContext | null = null;

  /**
   * Private constructor for singleton pattern.
   */
  private constructor() {}

  /**
   * Get singleton instance of AuthService.
   * @returns AuthService instance.
   */
  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Initialize the authentication service with API request context.
   * @param request - Playwright API request context.
   */
  async initialize(request: APIRequestContext): Promise<void> {
    this.request = request;
  }

  /**
   * Authenticate using username/password and acquire access token.
   * @returns Promise resolving to the access token.
   * @throws Error if authentication fails or credentials are missing.
   */
  async authenticate(): Promise<string> {
    if (!this.request) {
      throw new Error('AuthService not initialized. Call initialize() first.');
    }

    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;
    const apiUrl = process.env.API_URL;
    if (!apiUrl) {
      throw new Error('Missing API_URL in environment variables.');
    }
    const tokenUrl = `${apiUrl}/OacWeb/token`;

    if (!username || !password) {
      throw new Error('Missing ADMIN_USERNAME or ADMIN_PASSWORD in environment variables.');
    }

    console.log('Authenticating to acquire token...');

    try {
      const response = await this.request.post(tokenUrl, {
        headers: {
          'accept': 'application/json, text/plain, */*',
          'accept-language': 'en-US,en;q=0.9',
          'content-type': 'application/x-www-form-urlencoded',
          'origin': apiUrl,
          'referer': `${apiUrl}/`,
          'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36 Edg/146.0.0.0'
        },
        form: {
          username: username,
          password: password,
          rememberMe: 'false',
          grant_type: 'password'
        }
      });

      if (!response.ok()) {
        const errorText = await response.text();
        throw new Error(`Authentication failed: ${response.status()} ${response.statusText()}. Response: ${errorText}`);
      }

      const authData = await response.json();
      const accessToken = authData.access_token;

      if (!accessToken) {
        throw new Error('No access_token received in authentication response.');
      }

      this.token = accessToken;
      console.log('Authentication successful. Token acquired.');

      // Store token in environment variable for existing ApiClient compatibility
      process.env.API_TOKEN = accessToken;

      return accessToken;

    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  }

  /**
   * Get the current authentication token.
   * @returns The access token or null if not authenticated.
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Check if service is authenticated and has a valid token.
   * @returns True if authenticated, false otherwise.
   */
  isAuthenticated(): boolean {
    return this.token !== null && this.token.length > 0;
  }

  /**
   * Ensure authentication is complete. Authenticate if not already done.
   * @returns Promise resolving to the access token.
   */
  async ensureAuthenticated(): Promise<string> {
    if (this.isAuthenticated()) {
      return this.token!;
    }

    return await this.authenticate();
  }
}
