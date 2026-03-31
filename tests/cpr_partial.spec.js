import { test, expect } from '@playwright/test';
import { FakeDataPage } from './pages/FakeDataPage.js';

test.describe('CPR partial generation - birthdate validation', () => {
  let fakePage;

  test.beforeEach(async ({ page }) => {
    fakePage = new FakeDataPage(page);
    await fakePage.goto();
  });

  test('partial CPR contains a valid birthdate in first 6 digits', async () => {
    await fakePage.generatePartial('cpr');
    await expect(fakePage.cprValues.first()).toBeVisible();
    const cpr = await fakePage.cprValues.first().innerText();
    expect(fakePage.cprHasValidBirthDate(cpr)).toBe(true);
  });

  test('partial CPR, name and gender - CPR contains a valid birthdate in first 6 digits', async () => {
    await fakePage.generatePartial('cpr-name-gender');
    await expect(fakePage.cprValues.first()).toBeVisible();
    const cpr = await fakePage.cprValues.first().innerText();
    expect(fakePage.cprHasValidBirthDate(cpr)).toBe(true);
  });

  test('partial CPR, name, gender and birthdate - CPR first 6 digits match displayed date of birth', async () => {
    await fakePage.generatePartial('cpr-name-gender-dob');
    await expect(fakePage.cprValues.first()).toBeVisible();
    await expect(fakePage.dobValues.first()).toBeVisible();

    const cpr = await fakePage.cprValues.first().innerText();
    const dob = await fakePage.dobValues.first().innerText();

    expect(fakePage.cprDateMatchesDob(cpr, dob)).toBe(true);
  });
});
