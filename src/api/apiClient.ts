import { APIRequestContext, request } from '@playwright/test';

/**
 * Base API client wrapper using Playwright request for all API interactions.
 * Provides common functionality for authentication, request handling, and error management.
 */
export class ApiClient {
  protected request!: APIRequestContext;
  protected baseUrl: string;

  /**
   * Initialize the API client with base URL and authentication.
   * @param baseUrl - The base URL for API requests
   * @param options - Optional configuration for request context
   */
  protected constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Static factory method to create an async API client instance.
   * @param baseUrl - The base URL for API requests
   * @param options - Optional configuration for request context
   * @returns Promise resolving to ApiClient instance
   */
  static async create(baseUrl: string, options?: { extraHTTPHeaders?: Record<string, string> }): Promise<ApiClient> {
    const client = new ApiClient(baseUrl);
    client.request = await request.newContext({
      baseURL: baseUrl,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        ...options?.extraHTTPHeaders,
      },
    });
    return client;
  }

  /**
   * Perform a GET request to the specified endpoint.
   * @param endpoint - The API endpoint path
   * @param params - Optional query parameters
   * @returns Promise resolving to the response data
   */
  async get(endpoint: string, params?: Record<string, any>): Promise<any> {
    console.log(`🔍 API GET: ${this.baseUrl}${endpoint}`, params || {});
    
    const response = await this.request.get(endpoint, {
      params,
    });
    
    const responseData = await response.json();
    console.log(`✅ API GET Response: ${response.status()}`, responseData);
    
    if (!response.ok()) {
      throw new Error(`GET ${endpoint} failed: ${response.status()} ${response.statusText()}`);
    }
    
    return responseData;
  }

  /**
   * Perform a POST request to the specified endpoint.
   * @param endpoint - The API endpoint path
   * @param data - Request body data
   * @param params - Optional query parameters
   * @returns Promise resolving to the response data
   */
  async post(endpoint: string, data?: any, params?: Record<string, any>): Promise<any> {
    console.log(`🔍 API POST: ${this.baseUrl}${endpoint}`, { data, params });
    
    const response = await this.request.post(endpoint, {
      data,
      params,
    });
    
    const responseData = await response.json();
    console.log(`✅ API POST Response: ${response.status()}`, responseData);
    
    if (!response.ok()) {
      throw new Error(`POST ${endpoint} failed: ${response.status()} ${response.statusText()}`);
    }
    
    return responseData;
  }

  /**
   * Perform a PUT request to the specified endpoint.
   * @param endpoint - The API endpoint path
   * @param data - Request body data
   * @param params - Optional query parameters
   * @returns Promise resolving to the response data
   */
  async put(endpoint: string, data?: any, params?: Record<string, any>): Promise<any> {
    const response = await this.request.put(endpoint, {
      data,
      params,
    });
    
    if (!response.ok()) {
      throw new Error(`PUT ${endpoint} failed: ${response.status()} ${response.statusText()}`);
    }
    
    return response.json();
  }

  /**
   * Perform a DELETE request to the specified endpoint.
   * @param endpoint - The API endpoint path
   * @param params - Optional query parameters
   * @returns Promise resolving to the response data
   */
  async delete(endpoint: string, params?: Record<string, any>): Promise<any> {
    const response = await this.request.delete(endpoint, {
      params,
    });
    
    if (!response.ok()) {
      throw new Error(`DELETE ${endpoint} failed: ${response.status()} ${response.statusText()}`);
    }
    
    return response.json();
  }

  /**
   * Clean up the request context and release resources.
   * @returns Promise resolving when cleanup is complete
   */
  async dispose(): Promise<void> {
    await this.request.dispose();
  }
}
