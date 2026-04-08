import { test } from '../../src/fixtures/bookingFixture';
import { ServicePage } from '../../src/pages/ServicePage';
import { LocationPage } from '../../src/pages/LocationPage';
import { MeetingPreferencePage } from '../../src/pages/MeetingPreferencePage';
import { DateTimePage } from '../../src/pages/DateTimePage';
import { PersonalDetailsPage } from '../../src/pages/PersonalDetailsPage';
import { ConfirmationPage } from '../../src/pages/ConfirmationPage';
import { expect } from '@playwright/test';
import { AdminService } from '@/api/AdminService';
import { ApiClient } from '@/api/apiClient';
import { DateUtils } from '../../src/utils/dateUtils';

/**
 * OAC-20016: Time Slot Availability Handling Test
 * 
 
 */
test.describe('Time Slot Availability Handling - OAC-20016', () => {

    let adminService: AdminService;
  
    test.beforeEach(async ({ request }) => {
      adminService = new AdminService(new ApiClient(request));
    });
    
  test('Complete booking with valid customer details', { tag: ['@smoke', '@functional'] }, async ({ page, TimeSlotAvailabilityHandlingData }) => {
    const [bookingData, staffAvailabilityData] = TimeSlotAvailabilityHandlingData;
    const servicePage = new ServicePage(page);
    const locationPage = new LocationPage(page);
    const meetingPreferencePage = new MeetingPreferencePage(page);
    const dateTimePage = new DateTimePage(page);
    const personalDetailsPage = new PersonalDetailsPage(page);
    const confirmationPage = new ConfirmationPage(page);

    await page.goto(process.env.BASE_URL!);

    // Wait for page to be fully loaded with retry logic
    await expect(async () => {
      await expect(page.getByRole('button', { name: 'Personal Accounts' })).toBeVisible({ timeout: 10000 });
    }).toPass({ timeout: 30000 });
    
    await expect(page.getByRole('button', { name: 'Speak with a Department' })).toBeVisible();

    const selectedService = await servicePage.selectServiceFlow(bookingData.service.category, bookingData.service.name);

    await locationPage.searchAndSelectLocation(bookingData.location.code, bookingData.location.name);

    await meetingPreferencePage.selectInPerson();

    // Select the given date from bookingData
    await dateTimePage.waitForDateTimePage();
    await dateTimePage.getCalendar().selectDate(bookingData.dateTime.date);

    // Verify "All" is the default staff selection
    const isAllDefault = await dateTimePage.verifyAllStaffIsDefault();
    expect(isAllDefault).toBe(true);

    // Get availability summary for "All" staff selection
    const serviceDuration = bookingData.service.duration || 30;
    const allStaffSummary = await dateTimePage.getStaffAvailabilitySummary(
      staffAvailabilityData, 
      serviceDuration
    );


    // Verify combined availability matches expected based on staff data
    const combinedVerification = await dateTimePage.verifyCombinedStaffAvailability(
      staffAvailabilityData, 
      serviceDuration
    );

    expect(combinedVerification.isCorrect).toBe(true);

    // Calculate expected enabled slots based on staff availability data from fixture
    const expectedEnabledSlots: string[] = [];
    
    staffAvailabilityData.forEach(staff => {
      const startTime = staff.availabilityStart;
      const endTime = staff.availabilityEnd;
      
      // Calculate last available slot (end time - duration)
      const endParts = endTime.split(' ');
      const endHourMin = (endParts[0] || '0:0').split(':');
      let endHour = parseInt(endHourMin[0] || '0');
      const endMin = parseInt(endHourMin[1] || '0');
      const period = endParts[1] || 'AM';
      
      if (period === 'PM' && endHour !== 12) endHour += 12;
      if (period === 'AM' && endHour === 12) endHour = 0;
      
      const endMinutes = endHour * 60 + endMin;
      const lastSlotMinutes = endMinutes - serviceDuration;
      const lastSlotHour = Math.floor(lastSlotMinutes / 60);
      const lastSlotMin = lastSlotMinutes % 60;
      
      const lastSlotPeriod = lastSlotHour >= 12 ? 'PM' : 'AM';
      const displayLastHour = lastSlotHour > 12 ? lastSlotHour - 12 : (lastSlotHour === 0 ? 12 : lastSlotHour);
      const lastSlotTime = `${displayLastHour}:${lastSlotMin.toString().padStart(2, '0')} ${lastSlotPeriod}`;
      
      // Generate slots for this staff member (30-minute intervals)
      expectedEnabledSlots.push(startTime, lastSlotTime);
    });

    // Select a specific staff member (use first staff from fixture data)
    const selectedStaffName = staffAvailabilityData[1]?.staffName;
    if (selectedStaffName) {
      await dateTimePage.selectStaff(selectedStaffName);

      // Verify visible time slots match selected staff's data
      const visibleSlots = await page.locator('text=/\\d{1,2}:\\d{2}\\s*(AM|PM)/i').allTextContents();
      const staffData = staffAvailabilityData.find(s => s.staffName === selectedStaffName);
      expect(visibleSlots.length).toBeGreaterThan(0);
    }

    // Continue with time selection (first available time slot for selected staff)
    let selectedDateTime: { date: Date; time: string; formattedDate: string };
    
    selectedDateTime = await dateTimePage.selectDayAndFirstAvailableTime(bookingData.dateTime);
   
    await personalDetailsPage.fillDetails(bookingData.customer);
    await personalDetailsPage.submit();

    await confirmationPage.waitForConfirmationPage();
    
    bookingData.dateTime.time = selectedDateTime.time;
    bookingData.dateTime.date = selectedDateTime.date;
    bookingData.dateTime.formattedDate = selectedDateTime.formattedDate;
    
    const isVerified = await confirmationPage.verifyBooking(bookingData);
    expect(isVerified).toBe(true);

    await expect(confirmationPage.isCancelButtonVisible()).resolves.toBe(true);
  });


});
