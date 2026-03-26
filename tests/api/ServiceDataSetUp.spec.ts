import { test, expect } from '@playwright/test';
import { ApiClient } from '../../src/api/apiClient';
import { ProductService } from '../../src/api/ProductService';

test('Verify service details via API setup', async ({ request }) => {
  const apiClient = new ApiClient(request);
  const productService = new ProductService(apiClient);

  const response = await productService.getProductById(54, 1108);
  
  expect(response.ok()).toBeTruthy();
  const data = await response.json();
  
  console.log(data);
});