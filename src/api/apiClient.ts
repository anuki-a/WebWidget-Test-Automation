import { APIRequestContext, APIResponse } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export class ApiClient {
  private request: APIRequestContext;
  private defaultHeaders: Record<string, string>;

  constructor(request: APIRequestContext, token?: string) {
    this.request = request;
    // Use provided token, fallback to environment variable
    const authToken = token || process.env.API_TOKEN;
    this.defaultHeaders = {
      'accept': 'application/json, text/plain, */*',
      'sec-ch-ua-platform': '"Android"',
      'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36...',
      // If token is provided or exists in env, add it to defaults
      ...(authToken && { 'authorization': `Bearer ${authToken}` })
    };
  }

  async get(endpoint: string, params?: Record<string, string | number>, customHeaders?: Record<string, string>) {
    return await this.request.get(endpoint, {
      params: params, // Handles the ?clientId=54&userId=140858 part
      headers: { ...this.defaultHeaders, ...customHeaders },
    });
  }

  async post(endpoint: string, data: any, customHeaders?: Record<string, string>) {
    return await this.request.post(endpoint, {
      data: data,
      headers: { ...this.defaultHeaders, ...customHeaders },
    });
  }

  async put(endpoint: string, data: any, customHeaders?: Record<string, string>) {
    return await this.request.put(endpoint, {
      data: data,
      headers: { ...this.defaultHeaders, ...customHeaders },
    });
  }

  async delete(endpoint: string, customHeaders?: Record<string, string>) {
    return await this.request.delete(endpoint, {
      headers: { ...this.defaultHeaders, ...customHeaders },
    });
  }
}