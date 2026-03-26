import { ApiClient } from './apiClient';

/**
 * Service to handle product-related API calls.
 */
export class ProductService {
  private client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client;
  }

  /**
   * Fetches product details by Client ID and Product ID.
   * Path: /OacWeb/oac/client/ServiceByIdOnly
   * * @param clientId - The unique identifier for the client (e.g., 54)
   * @param productId - The unique identifier for the product (e.g., 1108)
   */
  async getProductById(clientId: string | number, productId: string | number) {
    const endpoint = '/OacWeb/oac/client/ServiceByIdOnly';
    
    const params = {
      clientId: clientId.toString(),
      serviceId: productId.toString(),
    };

    // We use the 'get' method from ApiClient which automatically 
    // appends baseURL and default headers.
    const response = await this.client.get(endpoint, params);
    
    return response;
  }
}