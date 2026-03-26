
import { test, expect } from '@playwright/test';
import { FakeDataPage } from './pages/FakeDataPage.js';

test('generated CPR matches gender rule', async ({ page }) => {
  const fakePage = new FakeDataPage(page);
  await fakePage.goto();
  await fakePage.generateButton.click();

  const genderText = await fakePage.genderValues.first().innerText();
  const cprText = await fakePage.cprValues.first().innerText();

  const gender = genderText.trim().toLowerCase();
  const cpr = cprText.trim();

  // CPR must be exactly 10 digits
  expect(cpr).toMatch(/^\d{10}$/);

  const lastDigit = Number(cpr[cpr.length - 1]);
  console.log({ cpr, gender });

  if (gender === 'male') {
    expect(lastDigit % 2).toBe(1); // odd
  } else if (gender === 'female') {
    expect(lastDigit % 2).toBe(0); // even
  } else {
    throw new Error(`Unknown gender: ${gender}`);
  }
});
