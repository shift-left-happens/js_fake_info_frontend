
import { test, expect } from '@playwright/test';
import { FakeDataPage } from './pages/FakeDataPage.js';

test('generated CPR matches gender rule', async ({ page }) => {
  const fakePage = new FakeDataPage(page);
  await fakePage.goto();

  for (let i = 0; i < 20; i++) {
    await fakePage.generateButton.click();

    const genderText = await fakePage.genderValues.first().innerText();
    const cprText = await fakePage.cprValues.first().innerText();

    const gender = genderText.trim().toLowerCase();
    const cpr = cprText.trim();

    expect(cpr).toMatch(/^\d{10}$/);

    const lastDigit = Number(cpr[cpr.length - 1]);

    if (gender === 'male') {
      expect(lastDigit % 2).toBe(1);
    } else if (gender === 'female') {
      expect(lastDigit % 2).toBe(0);
    } else {
      throw new Error(`Unknown gender: ${gender}`);
    }
  }
});
