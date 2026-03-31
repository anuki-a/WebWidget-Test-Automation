import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://ac-qa.fmsidev.us/AppointmentWidget/service?urlCode=MPCDSXKRCD&cby=user_a_0001');
  await page.getByRole('button', { name: 'Notary and Medallion Services' }).click();
  await page.getByRole('link', { name: 'Notary  30 Mins Notary' }).click();
  await page.getByRole('button', { name: 'Northcliffe 22015 N IH 35' }).click();
  await page.getByRole('link', { name: '31' }).click();
  await page.getByRole('button', { name: '12:30 AM' }).click();
  await page.getByRole('textbox', { name: 'First Name *' }).click();
  await page.getByRole('textbox', { name: 'First Name *' }).fill('qweq');
  await page.getByRole('textbox', { name: 'Last Name *' }).click();
  await page.getByRole('textbox', { name: 'Last Name *' }).fill('Last');
  await page.getByRole('textbox', { name: 'Email *' }).click();
  await page.getByRole('textbox', { name: 'Email *' }).fill('asda@gsdf.aqa');
  await page.getByRole('textbox', { name: 'Phone No. *' }).click();
  await page.getByRole('textbox', { name: 'Phone No. *' }).fill('123-2334-');
  await page.getByRole('textbox', { name: 'Phone No. *' }).press('NumLock');
  await page.getByRole('textbox', { name: 'Phone No. *' }).fill('123-233-5454');
  await page.getByRole('textbox', { name: 'Membership required. Please' }).click();
  await page.getByRole('textbox', { name: 'Membership required. Please' }).click();
  await page.getByRole('textbox', { name: 'Membership required. Please' }).fill('asdasdddd');
});