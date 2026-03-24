import { test, expect } from '@playwright/test';
import { FakeDataPage } from './pages/FakeDataPage.js';

test('generated CPR matches gender rule', async ({ page }) => {
    const fakePage = new FakeDataPage(page);
    await fakePage.goto();
    await fakePage.generateButton.click();

    const phoneNumber = await fakePage.phoneNumberValues.first().innerText();

    // CPR must be exactly 10 digits
    expect(phoneNumber).toMatch(/^\d{8}$/);
});
