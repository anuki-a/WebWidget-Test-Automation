import { test, expect } from '@playwright/test';
import { ApiClient } from '../../src/api/apiClient';
import { ProductService } from '../../src/api/ProductService';
import serviceData from '../../src/data/services.json';

test('Verify service details via API setup', async ({ request }) => {
  const apiClient = new ApiClient(request);
  const productService = new ProductService(apiClient);

  const response = await productService.getProductById(54, 1108);
  
  expect(response.ok()).toBeTruthy();
  const data = await response.json();
  
  console.log(data);
});


// // guessing that these created a data issue in some survices. therefore keeping them commented.
// test('Update service via API- DisableAppointmentCancellationOrUpdate=false', async ({ request }) => {
//   const apiClient = new ApiClient(request);
//   const productService = new ProductService(apiClient);

//   // Test with disableCancellation set to false (overriding the JSON default of true)
//   const response = await productService.UpdateService(
//     serviceData.updatePersonalAccount.serviceData, 
//     serviceData.updatePersonalAccount.saveOptions,
//     false // Override DisableAppointmentCancellationOrUpdate to false
//   );
  
//   expect(response.ok()).toBeTruthy();
//   const data = await response.json();
  
//   console.log('Service updated successfully:', data);
// });

// test('Update service via API- DisableAppointmentCancellationOrUpdate=true', async ({ request }) => {
//   const apiClient = new ApiClient(request);
//   const productService = new ProductService(apiClient);

//   // Test with disableCancellation set to true (overriding the JSON default of true)
//   const response = await productService.UpdateService(
//     serviceData.updatePersonalAccount.serviceData, 
//     serviceData.updatePersonalAccount.saveOptions,
//     true // Override DisableAppointmentCancellationOrUpdate to true
//   );
  
//   expect(response.ok()).toBeTruthy();
//   const data = await response.json();
  
//   console.log('Service updated successfully:', data);
// });