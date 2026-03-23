import { test as base } from '@playwright/test';
import { BookingData } from '../types/bookingTypes';
import { TestDataBuilder } from '../utils/testDataBuilder';
import { DateUtils } from '../utils/dateUtils';
import { MeetingPreference } from '@/pages/MeetingPreferencePage';

export const test = base.extend<{ bookingData: BookingData }>({
  bookingData: async ({}, use: (data: BookingData) => Promise<void>) => {
    // Generate customer data using TestDataBuilder
    const customer = TestDataBuilder.generateCustomer();
    
    // Generate date/time data
    const today = DateUtils.getToday();
    const formattedDate = DateUtils.formatDateForUI(today);
    
    const rawName = 'Update Personal Account  60';
    const cleanName = rawName.replace(/\s?[^\w\s].*$/, '').trim();

    // Create complete booking data
    const data: BookingData = {
      service: {
        category: 'Personal Accounts',
        name: rawName,
        displayName: cleanName,
        duration: 60
      },
      location: {
        code: '75071',
        name: 'McKinney 2093 N. Central',
        confirmationName: 'McKinney'
      },
      dateTime: {
        date: today,
        formattedDate: formattedDate.fullDateString,
        time: '10:00 AM',
      },
      customer: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone
      },
      meetingPreference: {
        type: 'in-person',
        displayName: MeetingPreference.IN_PERSON
      }
    };
    await use(data);
  }
});
