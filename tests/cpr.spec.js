
import { test, expect } from '@playwright/test';

test('generated CPR matches gender rule', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await page.getByRole('button', { name: 'Generate' }).click();

  const genderText = await page.locator('.genderValue').innerText();
  const cprText = await page.locator('.cprValue').innerText();

  const gender = genderText.trim().toLowerCase();
  const cpr = cprText.trim();

  console.log({ gender, cpr });

  // CPR must be exactly 10 digits
  expect(cpr).toMatch(/^\d{10}$/);

  const lastDigit = Number(cpr[cpr.length - 1]);

  if (gender === 'male') {
    expect(lastDigit % 2).toBe(1); // odd
  } else if (gender === 'female') {
    expect(lastDigit % 2).toBe(0); // even
  } else {
    throw new Error(`Unknown gender: ${gender}`);
  }
});