// tests/screenshots.spec.js
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { FakeDataPage } from './pages/FakeDataPage.js';

const screenshotDir = path.resolve('tests/screenshots');

test.describe('Index page visual regression (3 persons, masked dynamic content)', () => {
  let fakePage;

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Point frontend to local API if needed
    await page.addInitScript(() => {
      window.__API_URL__ = 'http://localhost:8081';
    });

    fakePage = new FakeDataPage(page);
    await fakePage.goto();
  });

  test('full-page visual regression with 3 persons', async ({ page }) => {
    // Generate 3 random persons
    await fakePage.generatePerson(3);
    await expect(fakePage.personCards.first()).toBeVisible();
    // Mask dynamic content before screenshot
    await page.evaluate(() => {
      const dynamicSelectors = [
        '.firstNameValue',
        '.lastNameValue',
        '.cprValue',
        '.dobValue',
        '.phoneNumberValue',
        '.streetValue',
        '.townValue',
        '.genderValue'
      ];
      dynamicSelectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => el.textContent = 'XXXXX');
      });
    });

    // Take full-page screenshot and compare with baseline
    await expect(page).toHaveScreenshot(
        'index-3-persons.png',
      {
        fullPage: true,
        // maxDiffPixelRatio: 0.01, // fail if >1% pixels differ
      }
    );
  });
});