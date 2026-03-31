import { test, expect } from '@playwright/test';
import { ApiClient } from '../../src/api/apiClient';
import { ProductService } from '../../src/api/ProductService';
import serviceData from '../../src/data/services.json';
import { AdminService } from '@/api/AdminService';
import { test as bookingTest } from '../../src/fixtures/bookingFixture';
import { DateUtils } from '@/utils/dateUtils';

test('Verify service details via API setup', async ({ request }) => {
  const apiClient = new ApiClient(request);
  const productService = new ProductService(apiClient);

  const response = await productService.getProductById(54, 1108);
  
  expect(response.ok()).toBeTruthy();
  const data = await response.json();
  
  console.log(data);
});


test.describe('Admin System Settings Data Setup', () => {
  let adminService: AdminService;

  test.beforeEach(async ({ request }) => {
    const apiClient = new ApiClient(request);
    adminService = new AdminService(apiClient);
  });

  test('should enable email and phone requirements', async () => {
    const response = await adminService.updateContactRequirements(true, true);
    
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    
    // Validate the response contains the updated values
    const config = body.Entities[0];
    expect(config.RequireCustomerEmail).toBe(true);
    expect(config.RequireCustomerPhone).toBe(true);
  });

  test('should disable email and phone requirements', async () => {
    const response = await adminService.updateContactRequirements(false, false);
    
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    
    const config = body.Entities[0];
    expect(config.RequireCustomerEmail).toBe(false);
    expect(config.RequireCustomerPhone).toBe(false);
  });
});

test('should fetch product details by ID ->setup OAC-20010', async ({request}) => {
    const apiClient = new ApiClient(request);
    const productService = new ProductService(apiClient);
    const clientId = 54;
    const productId = 386;

    // 3. Call the method that corresponds to your CURL request
    const response = await productService.getProductById(clientId, productId);

    // Assertions
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    console.log('Product Data:', data);
    
    // Example assertion on returned data
    expect(data).toBeDefined();
  });

bookingTest('should setup OAC-20010 by fetching and updating product preferences', async ({ request, singleMeetingPreferenceBookingData }) => {
  const apiClient = new ApiClient(request);
  const productService = new ProductService(apiClient);
  
  const clientId = 54;
  const productId = 392; 
  const targetLocationId = 26;

  // 1. GET current data
  const getResponse = await productService.getProductById(clientId, productId);
  expect(getResponse.ok()).toBeTruthy();
  const rawData = await getResponse.json();
  const serviceEntity = Array.isArray(rawData) ? rawData[0] : rawData;

  const { meetingPreference } = singleMeetingPreferenceBookingData;

  // 2. CLEAN and CONSTRUCT the payload
  // We use destructuring to strip out OData metadata and Navigation Properties
  const { 
    $id, $type,           // Metadata from OData/Breeze
    Location, Service1,   // Navigation properties (The 500 Error Culprits)
    Service2, ServiceCategory, 
    ServiceType, User, 
    User1, UserServices, 
    AppointmentServiceRequests,
    entityAspect: oldAspect, // We will replace this entirely
    ...cleanEntity         // Everything else (the actual DB columns)
  } = serviceEntity;

  const modifiedService = {
    ...cleanEntity,
    FkLocationId: targetLocationId,
    AllowInPersonAppointments: meetingPreference.type === 'in-person',  
    AllowPhoneAppointments: meetingPreference.type === 'phone',
    AllowVirtualAppointments: meetingPreference.type === 'virtual',
    
    // Reconstruct a clean entityAspect
    entityAspect: {
      entityTypeName: "Service:#Oac.Model.Data.ClientData",
      defaultResourceName: "Services",
      entityState: "Modified",
      originalValuesMap: {
        // As you noted, manage the true/false logic via fixtures
        AllowPhoneAppointments: serviceEntity.AllowPhoneAppointments,
        AllowInPersonAppointments: serviceEntity.AllowInPersonAppointments,
        AllowVirtualAppointments: serviceEntity.AllowVirtualAppointments
      }
    }
  };

  // 3. POST back
  const saveOptions = {
    tag: `${clientId},false,${targetLocationId}`
  };

  console.log('Modified Service:', JSON.stringify(modifiedService, null, 2));
  console.log('Save Options:', JSON.stringify(saveOptions, null, 2));
  const saveResponse = await productService.saveService([modifiedService], saveOptions);

  if (!saveResponse.ok()) {
    console.error(`Status: ${saveResponse.status()}`);
    console.error(`Body: ${await saveResponse.text()}`);
  }

  expect(saveResponse.ok(), 'Failed to save product updates').toBeTruthy();
});


bookingTest('should add a new holiday 2 business days from now', async ({ request }) => {
  const apiClient = new ApiClient(request);
  const adminService = new AdminService(apiClient);

  // 1. Calculate dynamic date (matching the original midnight format)
  const today = new Date();
  const futureDate = DateUtils.addBusinessDays(today, 2);
  futureDate.setUTCHours(0, 0, 0, 0);
  const isoDate = futureDate.toISOString();

  // 2. Full payload including the "__unmapped" block which is often required by Breeze/OData
  const holidayData = {
    HolidayId: -88,
    FkHolidayParentId: null,
    FkLocationId: 1,
    HolidayName: `Auto Holiday ${isoDate.split('T')[0]}`,
    HolidayCode: "X",
    Date: isoDate,
    StartTime: isoDate,
    EndTime: isoDate,
    IsAllDay: true,
    OptIn: true,
    CreatedBy: 0,
    CreatedDate: "1899-12-31T18:40:28.000Z", // Original placeholder from your Postman
    ChangedBy: null,
    ChangedDate: null,
    InheritedStatus: "I",
    ActiveStatus: 1,
    IsBlackout: false,
    OptInSubLocations: false,
    CCHolidayId: null,
    HolidayDisplayName: null,
    HolidayNameSpanish: null,
    HolidayDisplayNameSpanish: null,
    // CRITICAL: The server likely throws a NullReferenceException if this block is missing
    __unmapped: {
      DayOfWeek: "",
      Start: "",
      End: "",
      Inherited: "Inherited",
      OptInStatus: true,
      HolidayDate: isoDate 
    },
    entityAspect: {
      entityTypeName: "Holiday:#Oac.Model.Data.ClientData",
      defaultResourceName: "Holidays",
      entityState: "Added",
      originalValuesMap: {},
      autoGeneratedKey: {
        propertyName: "HolidayId",
        autoGeneratedKeyType: "Identity"
      }
    }
  };

  const options = { tag: "54,1" };

  const response = await adminService.saveHoliday(holidayData, options);

  // Validation
  expect(response.ok()).toBeTruthy();
});

test('should verify the holiday exists in the list', async ({ request }) => {
  const apiClient = new ApiClient(request);
  const adminService = new AdminService(apiClient);

  const year = 2026;
  const clientId = 54;
  const locationId = 1;

  const response = await adminService.getAllHolidays(year, clientId, locationId);
  
  expect(response.ok()).toBeTruthy();
  
  const data = await response.json();
  
  // Check if data exists and is an array
  if (!data || !Array.isArray(data)) {
    console.error('Expected array but got:', typeof data, data);
    throw new Error(`Expected array but got ${typeof data}`);
  }
  
  // Verify we have holidays in the response
  expect(data.length).toBeGreaterThan(0);
  
  // Check that holidays have valid names
  const holidayExists = data.some((h: any) => h.HolidayName && h.HolidayName.length > 0);
  expect(holidayExists).toBe(true);
  
  // Optional: Log found holidays for debugging
  const holidayNames = data.map((h: any) => h.HolidayName).filter(name => name);
  console.log('Found holidays:', holidayNames);
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