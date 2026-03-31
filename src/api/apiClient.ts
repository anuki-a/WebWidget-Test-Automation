import { APIRequestContext, APIResponse } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * API client for making HTTP requests to the appointment widget services.
 * Provides methods for GET, POST, PUT, and DELETE operations with default headers.
 */
export class ApiClient {
  private request: APIRequestContext;
  private defaultHeaders: Record<string, string>;
  private baseURL: string;
  private extraHeaders: Record<string, string>;

  /**
   * Initialize the API client with request context and optional authentication token.
   * @param request - Playwright API request context for making HTTP calls.
   * @param token - Optional authentication token. If not provided, will use API_TOKEN from environment variables.
   */
  constructor(request: APIRequestContext, token?: string) {
    this.request = request;
    this.baseURL = process.env.API_URL || '';
    // Use provided token, fallback to environment variable
    const authToken = token || process.env.API_TOKEN;
    this.defaultHeaders = {
      'accept': 'application/json, text/plain, */*',
      ...(authToken && { 'authorization': `Bearer ${authToken}` }),
      'content-type': 'application/json;charset=UTF-8',
      'sec-ch-ua-platform': '"Android"',
      'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36...',
      'referer': `${this.baseURL}/`,
      'origin': this.baseURL
    };
    this.extraHeaders = { ...this.defaultHeaders };
  }

  /**
   * Send GET request to specified endpoint.
   * @param endpoint - The API endpoint URL.
   * @param params - Optional query parameters for the request.
   * @returns Promise resolving to the API response.
   */
  async get(endpoint: string, params?: Record<string, string | number | boolean>) {
    const url = this.baseURL + endpoint;
    const response = await this.request.get(url, {
      params: params,
      headers: this.extraHeaders,
    });
    await this.logFailure(response, 'GET', url);
    return response;
  }

  /**
   * Send POST request to specified endpoint.
   * @param endpoint - The API endpoint URL.
   * @param data - The request body data to send.
   * @param customHeaders - Optional custom headers to override defaults.
   * @returns Promise resolving to the API response.
   */
  async post(endpoint: string, data: any, customHeaders?: Record<string, string>) {
    const url = this.baseURL + endpoint;
    const response = await this.request.post(url, {
      data: data,
      headers: { ...this.defaultHeaders, ...customHeaders },
    });
    await this.logFailure(response, 'POST', url);
    return response;
  }

  /**
   * Send PUT request to specified endpoint.
   * @param endpoint - The API endpoint URL.
   * @param data - The request body data to send.
   * @param customHeaders - Optional custom headers to override defaults.
   * @returns Promise resolving to the API response.
   */
  async put(endpoint: string, data: any, customHeaders?: Record<string, string>) {
    const url = this.baseURL + endpoint;
    const response = await this.request.put(url, {
      data: data,
      headers: { ...this.defaultHeaders, ...customHeaders },
    });
    await this.logFailure(response, 'PUT', url);
    return response;
  }

  /**
   * Send DELETE request to specified endpoint.
   * @param endpoint - The API endpoint URL.
   * @param customHeaders - Optional custom headers to override defaults.
   * @returns Promise resolving to the API response.
   */
  async delete(endpoint: string, customHeaders?: Record<string, string>) {
    const url = this.baseURL + endpoint;
    const response = await this.request.delete(url, {
      headers: { ...this.defaultHeaders, ...customHeaders },
    });
    await this.logFailure(response, 'DELETE', url);
    return response;
  }

  private async logFailure(response: APIResponse, method: string, url: string) {
    if (!response.ok()) {
      console.error(`\n API Failure: ${method} ${url}`);
      console.error(`Status: ${response.status()} ${response.statusText()}`);
      try {
        console.error(`Response Body: ${JSON.stringify(await response.json(), null, 2)}`);
      } catch (e) {
        console.error(`Response Body: ${await response.text()}`);
      }
    }
  }
}