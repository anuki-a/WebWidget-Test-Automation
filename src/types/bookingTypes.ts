import { CustomerData } from '../utils/testDataBuilder';

/**
 * Complete booking data for appointment booking tests.
 * Contains all data needed for end-to-end booking verification.
 */
export interface BookingData {
  service: ServiceData;
  location: LocationData;
  customer: CustomerData;
  meetingPreference: MeetingPreference;
  dateTime: DateTimeData;
}

/**
 * Service selection data.
 */
export interface ServiceData {
  category: string;
  name: string;
  displayName?: string;
  duration?: number;
}

/**
 * Location selection data.
 */
export interface LocationData {
  code: string;
  name: string;
  confirmationName?: string;
}

/**
 * Meeting preference selection data.
 */
export interface MeetingPreference {
  type: string;
  displayName: string;
}

/**
 * Date and time selection data.
 */
export interface DateTimeData {
  date: Date;
  formattedDate: string;
  time: string;
}
