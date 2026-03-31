import { test, expect } from '@playwright/test';
import { FakeDataPage } from './pages/FakeDataPage.js';

test.describe('Birth date tests', () => {
    let fakePage;

    test.beforeEach(async ({ page }) => {
        fakePage = new FakeDataPage(page);
        await fakePage.goto();
    });

    test('generated birth date has correct format YYYY-MM-DD', async () => {
        await fakePage.generateButton.click();
        await expect(fakePage.dobValues.first()).toBeVisible();
        const dob = await fakePage.dobValues.first().innerText();
        expect(dob.trim()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    test('generated birth date from partial options has correct format', async () => {
        await fakePage.generatePartial('name-gender-dob');
        await expect(fakePage.dobValues.first()).toBeVisible();
        const dob = await fakePage.dobValues.first().innerText();
        expect(dob.trim()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    test('generates multiple birth dates correctly', async () => {
        await fakePage.generatePerson(10);
        await expect(fakePage.dobValues.first()).toBeVisible();
        const count = await fakePage.dobValues.count();
        expect(count).toBe(10);
    });
});
