import { test, expect } from '@playwright/test';
import { ApiClient } from '../../src/api/apiClient';
import { ProductService } from '../../src/api/ProductService';
import serviceData from '../../src/data/services.json';
import { AdminService } from '@/api/AdminService';
import { AppointmentService } from '@/api/AppointmentService';
import { distinctLocations } from '@/fixtures/bookingFixture';
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
    // We only pass the fields we want to flip
    const response = await adminService.updateConfigSetting({ 
      RequireCustomerEmail: true, 
      RequireCustomerPhone: true 
    });
    
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    
    // Validate the response contains the updated values
    // Note: The API returns 'Entities' (Capitalized) in the response object
    const config = body.Entities[0];
    expect(config.RequireCustomerEmail).toBe(true);
    expect(config.RequireCustomerPhone).toBe(true);
  });

  test('should disable email and phone requirements', async () => {
    const response = await adminService.updateConfigSetting({ 
      RequireCustomerEmail: false, 
      RequireCustomerPhone: false 
    });
    
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    
    const config = body.Entities[0];
    expect(config.RequireCustomerEmail).toBe(false);
    expect(config.RequireCustomerPhone).toBe(false);
  });

  test('should enable appointment checklist in confirmation page', async () => {
    // Toggling the ShowCheckListInWidget setting to true
    const response = await adminService.updateConfigSetting({ 
      ShowCheckListInWidget: true 
    });
    
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    
    // Validate the response contains the updated value
    const config = body.Entities[0];
    expect(config.ShowCheckListInWidget).toBe(true);
  });

  test('should disable appointment checklist in confirmation page', async () => {
    // Toggling the ShowCheckListInWidget setting to false
    const response = await adminService.updateConfigSetting({ 
      ShowCheckListInWidget: false 
    });
    
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    
    // Validate the response reflects the disabled state
    const config = body.Entities[0];
    expect(config.ShowCheckListInWidget).toBe(false);
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


bookingTest('should add a new holiday 3 business days from now', async ({ request }) => {
  const apiClient = new ApiClient(request);
  const adminService = new AdminService(apiClient);

  // 1. Calculate dynamic date (matching the original midnight format)
  const today = new Date();
  const futureDate = DateUtils.addBusinessDays(today, 4);
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
      HolidayDate: new Date().toISOString() // Current timestamp 
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

test('should verify and then delete the generated holiday', async ({ request }) => {
  const apiClient = new ApiClient(request);
  const adminService = new AdminService(apiClient);

  const year = 2026;
  const clientId = 54;
  const locationId = 1;
  const targetHolidayName = "Auto Holiday";

  // 1. Get the holiday list
  const getResponse = await adminService.getAllHolidays(year, clientId, locationId);
  expect(getResponse.ok()).toBeTruthy();
  
  const holidays = await getResponse.json();
  expect(Array.isArray(holidays)).toBe(true);

  console.log("holiday[0].Location.Holidays[1].HolidayName : ",holidays[0].Location.Holidays[1].HolidayName);
  // 2. Find the specific holiday
  // Using .includes() to be safe, and checking case-insensitivity
  const holidayToDelete = holidays[0].Location.Holidays.find((h: any) => {
    // Ensure HolidayName exists and isn't null before calling .toLowerCase()
    return h.HolidayName && h.HolidayName.toLowerCase().includes(targetHolidayName.toLowerCase());
  });
  console.log(`Found holiday: ${holidayToDelete?.HolidayName} (ID: ${holidayToDelete?.HolidayId})`);
  
  // Verify it exists before attempting deletion
  expect(holidayToDelete, `Holiday with name "${targetHolidayName}" not found!`).toBeDefined();

  //3. Delete the holiday
  const deleteResponse = await adminService.deleteHoliday(holidayToDelete, clientId);
  
  // 4. Assert deletion success
  expect(deleteResponse.ok()).toBeTruthy();
  console.log(`Successfully deleted holiday: ${targetHolidayName}`);

  // Final Check: Verify it's gone from the list
  const finalCheckResponse = await adminService.getAllHolidays(year, clientId, locationId);
  const finalData = await finalCheckResponse.json();
  const existsAfterDelete = finalData.some((h: any) => h.HolidayId === holidayToDelete.HolidayId);
  
  expect(existsAfterDelete).toBe(false);
});

// guessing that these created a data issue in some survices. therefore keeping them commented.
test('Update service via API- DisableAppointmentCancellationOrUpdate=false', async ({ request }) => {
  const apiClient = new ApiClient(request);
  const productService = new ProductService(apiClient);

  // Test with disableCancellation set to false (overriding the JSON default of true)
  const response = await productService.UpdateServiceDisableAppointmentCancellationOrUpdate(
    serviceData.updatePersonalAccount.serviceData, 
    serviceData.updatePersonalAccount.saveOptions,
    false // Override DisableAppointmentCancellationOrUpdate to false
  );
  
  expect(response.ok()).toBeTruthy();
  const data = await response.json();
  
  console.log('Service updated successfully:', data);
});

test('Update service via API- DisableAppointmentCancellationOrUpdate=true', async ({ request }) => {
  const apiClient = new ApiClient(request);
  const productService = new ProductService(apiClient);

  // Test with disableCancellation set to true (overriding the JSON default of true)
  const response = await productService.UpdateServiceDisableAppointmentCancellationOrUpdate(
    serviceData.updatePersonalAccount.serviceData, 
    serviceData.updatePersonalAccount.saveOptions,
    true // Override DisableAppointmentCancellationOrUpdate to true
  );
  
  expect(response.ok()).toBeTruthy();
  const data = await response.json();
  
  console.log('Service updated successfully:', data);
});


bookingTest('should add a partial holiday 2 business days from now', async ({ request, partialHolidayHandlingData }) => {
  const apiClient = new ApiClient(request);
  const adminService = new AdminService(apiClient);

  // Get date and time data from fixture
  const holidayDate = partialHolidayHandlingData.partialHolidayDateTime.date;
  const startTimeString = partialHolidayHandlingData.partialHolidayDateTime.startTime;
  const endTimeString = partialHolidayHandlingData.partialHolidayDateTime.endTime;
  
  // Set Date to midnight UTC (as per curl)
  const midnightDate = new Date(holidayDate);
  midnightDate.setUTCHours(0, 0, 0, 0);

  // Parse time strings from fixture and convert to UTC dates
  const startParsedTime = DateUtils.parseTimeString(startTimeString);
  const startTime = new Date(holidayDate);
  startTime.setUTCHours(startParsedTime.hours, startParsedTime.minutes, 0, 0);

  const endParsedTime = DateUtils.parseTimeString(endTimeString);
  const endTime = new Date(holidayDate);
  endTime.setUTCHours(endParsedTime.hours, endParsedTime.minutes, 0, 0);

  const holidayData = {
    HolidayId: -610, // Matching curl ID
    FkHolidayParentId: null,
    FkLocationId: 1,
    HolidayName: "Auto Half Holiday",
    HolidayCode: "X",
    Date: midnightDate.toISOString(),
    StartTime: startTime.toISOString(),
    EndTime: endTime.toISOString(),
    IsAllDay: false, // Changed to false for partial holiday
    OptIn: true,
    CreatedBy: 0,
    CreatedDate: "1899-12-31T18:40:28.000Z",
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
    __unmapped: {
      DayOfWeek: "",
      Start: "",
      End: "",
      Inherited: "Inherited",
      OptInStatus: true,
      HolidayDate: midnightDate.toISOString()
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
  
  const responseBody = await response.json();
  // Ensure the server returned the entities correctly
  expect(responseBody.Entities.length).toBeGreaterThan(0);
});

test('should delete appointments in specified locations', async ({ request }) => {
  const apiClient = new ApiClient(request);
  const appointmentService = new AppointmentService(apiClient);
  
  // Get location codes from distinctLocations
  const targetLocationCodes = distinctLocations.map(location => location.locCode).filter((code): code is string => code !== undefined);
  console.log('Target location codes:', targetLocationCodes);
  
  // Get date range: today to 4 business days
  const { firstDate, lastDate } = appointmentService.getDateRangeForQuery();
  console.log('Date range:', { firstDate, lastDate });
  
  try {
    // 1. Get all appointments for the date range
    console.log('Fetching all appointments...');
    const allAppointmentsResponse = await appointmentService.getAllAppointments(
      54, 1, firstDate, lastDate, -1
    );
    
    expect(allAppointmentsResponse.ok()).toBeTruthy();
    const allAppointments = await allAppointmentsResponse.json();
    console.log(`Found ${allAppointments.length} total appointments`);
    
    if (allAppointments.length === 0) {
      console.log('No appointments found in the specified date range. Nothing to delete.');
      return; // Test passes - nothing to delete
    }
    
    // 2. Filter appointments by target locations
    console.log('Filtering appointments by location...');
    const filteredAppointments = appointmentService.filterAppointmentsByLocation(
      allAppointments, targetLocationCodes
    );
    
    // Log appointment counts by location
    let totalAppointmentsToDelete = 0;
    Object.entries(filteredAppointments).forEach(([locationCode, appointments]) => {
      const locationName = distinctLocations.find(loc => loc.locCode === locationCode)?.confirmationName || locationCode;
      console.log(`${locationName} (${locationCode}): ${appointments.length} appointments`);
      totalAppointmentsToDelete += appointments.length;
    });
    
    if (totalAppointmentsToDelete === 0) {
      console.log('No appointments found in target locations. Nothing to delete.');
      return; // Test passes - nothing to delete
    }
    
    // 3. Get appointment IDs for detailed data
    const appointmentIds: number[] = [];
    Object.values(filteredAppointments).forEach(appointments => {
      appointments.forEach(appointment => {
        if (appointment.AppointmentId) {
          appointmentIds.push(appointment.AppointmentId);
        }
      });
    });
    
    console.log(`Getting detailed data for ${appointmentIds.length} appointments...`);
    const detailedAppointmentsResponse = await appointmentService.getAppointmentsByIds(appointmentIds);
    expect(detailedAppointmentsResponse.ok()).toBeTruthy();
    const detailedAppointments = await detailedAppointmentsResponse.json();
    console.log(`Retrieved ${detailedAppointments.length} detailed appointment records`);
    console.log(detailedAppointments)
    
    // 4. Bulk delete appointments
    console.log('Deleting appointments...');
    const deleteResponse = await appointmentService.bulkDeleteAppointments(detailedAppointments);
    expect(deleteResponse.ok()).toBeTruthy();
    
    const deleteResult = await deleteResponse.json();
    console.log('Deletion response:', deleteResult);
    
    // 5. Verify deletion success and log results
    console.log('\n=== DELETION SUMMARY ===');
    Object.entries(filteredAppointments).forEach(([locationCode, appointments]) => {
      const locationName = distinctLocations.find(loc => loc.locCode === locationCode)?.confirmationName || locationCode;
      console.log(`${locationName} (${locationCode}): ${appointments.length} appointments deleted`);
    });
    console.log(`Total appointments deleted: ${totalAppointmentsToDelete}`);
    console.log('========================\n');
    
    // Verify the deletion was successful
    expect(deleteResult).toBeDefined();
    
  } catch (error) {
    console.error('Error during appointment deletion:', error);
    throw error;
  }
});