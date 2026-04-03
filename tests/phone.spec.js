import { test, expect } from '@playwright/test';
import { FakeDataPage } from './pages/FakeDataPage.js';
test.describe('Phone number tests', () => {
    let fakePage;
    let allowedPrefixes = [
        '2', '30', '31', '40', '41', '42', '50', '51', '52', '53', '60', '61', '71', '81', '91', '92', '93', '342',
        '344', '345', '346', '347', '348', '349', '356', '357', '359', '362', '365', '366', '389', '398', '431',
        '441', '462', '466', '468', '472', '474', '476', '478', '485', '486', '488', '489', '493', '494', '495',
        '496', '498', '499', '542', '543', '545', '551', '552', '556', '571', '572', '573', '574', '577', '579',
        '584', '586', '587', '589', '597', '598', '627', '629', '641', '649', '658', '662', '663', '664', '665',
        '667', '692', '693', '694', '697', '771', '772', '782', '783', '785', '786', '788', '789', '826', '827', '829'
    ];
    test.beforeEach(async ({ page }) => {
        await page.addInitScript(() => {
            window.__API_URL__ = 'http://localhost:8081';
        });
        fakePage = new FakeDataPage(page);
        await fakePage.goto();
    });

    test('generated phone number is valid length', async ({ page }) => {
        await fakePage.generateButton.click();
        await expect(fakePage.phoneNumberValues.first()).toBeVisible();
        const phoneNumber = await fakePage.phoneNumberValues.first().innerText();
        expect(phoneNumber.length).toBe(8);
    });

    test('generated phone number is a valid 8-digit number', async ({ page }) => {
        await fakePage.generateButton.click();
        await expect(fakePage.phoneNumberValues.first()).toBeVisible();
        const phoneNumber = await fakePage.phoneNumberValues.first().innerText();
        expect(phoneNumber).toMatch(/^\d{8}$/);
    });

    test('generated phone number has correct prefix', async ({ page }) => {
        await fakePage.generateButton.click();
        await expect(fakePage.phoneNumberValues.first()).toBeVisible();
        const phoneNumber = await fakePage.phoneNumberValues.first().innerText();

        const hasValidPrefix = allowedPrefixes.some(prefix =>
            phoneNumber.startsWith(prefix)
        );

        expect(hasValidPrefix).toBeTruthy();
    });

    test('generated phone number from partial options number is valid length', async ({ page }) => {
        await fakePage.partialRadio.check();
        await fakePage.partialOptionsDropdown.selectOption('Phone number');
        await fakePage.generateButton.click();
        await expect(fakePage.phoneNumberValues.first()).toBeVisible();
        const phoneNumber = await fakePage.phoneNumberValues.first().innerText();
        expect(phoneNumber.length).toBe(8);
    });

    test('generated phone number from partial options has correct format', async ({ page }) => {
        await fakePage.partialRadio.check();
        await fakePage.partialOptionsDropdown.selectOption('Phone number');
        await fakePage.generateButton.click();
        await expect(fakePage.phoneNumberValues.first()).toBeVisible();
        const phoneNumber = await fakePage.phoneNumberValues.first().innerText();
        expect(phoneNumber).toMatch(/^\d{8}$/);
    });

    test('generated phone number from partial options has correct prefix', async ({ page }) => {
        await fakePage.partialRadio.check();
        await fakePage.partialOptionsDropdown.selectOption('Phone number');
        await fakePage.generateButton.click();
        await expect(fakePage.phoneNumberValues.first()).toBeVisible();
        const phoneNumber = await fakePage.phoneNumberValues.first().innerText();

        const hasValidPrefix = allowedPrefixes.some(prefix =>
            phoneNumber.startsWith(prefix)
        );

        expect(hasValidPrefix).toBeTruthy();
    });

    test('generates multiple phone numbers correctly', async () => {
        await fakePage.generatePerson(100);

        await expect(fakePage.phoneNumberValues.first()).toBeVisible();
        const count = await fakePage.phoneNumberValues.count();
        expect(count).toBe(100);
    });
    test('generating twice gives different phone numbers', async () => {
        await fakePage.generatePerson();
        
        await expect(fakePage.phoneNumberValues.first()).toBeVisible();
        const first = await fakePage.phoneNumberValues.first().innerText();

        await fakePage.generatePerson();

        await expect(fakePage.phoneNumberValues.first())
            .not.toHaveText(first);

        const second = await fakePage.phoneNumberValues.first().innerText();

        expect(first).not.toBe(second);
    });
});