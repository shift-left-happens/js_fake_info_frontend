import { test, expect } from '@playwright/test';
import { FakeDataPage } from './pages/FakeDataPage.js';

const COUNT = 20;

// Format: "StreetName Number, Floor.Door"
function parseStreetLine(text) {
  const commaIndex = text.lastIndexOf(', ');
  const streetAndNumber = text.substring(0, commaIndex);
  const floorDoor = text.substring(commaIndex + 2);

  const lastSpaceIndex = streetAndNumber.lastIndexOf(' ');
  const street = streetAndNumber.substring(0, lastSpaceIndex);
  const number = streetAndNumber.substring(lastSpaceIndex + 1);

  const dotIndex = floorDoor.indexOf('.');
  const floor = floorDoor.substring(0, dotIndex);
  const door = floorDoor.substring(dotIndex + 1);

  return { street, number, floor, door };
}

// Format: "PostalCode TownName"
function parseTownLine(text) {
  const spaceIndex = text.indexOf(' ');
  const postalCode = text.substring(0, spaceIndex);
  const townName = text.substring(spaceIndex + 1);
  return { postalCode, townName };
}

// ─── Street ─────────────────────────────────────────────────────────────────

test.describe('Address – Street', () => {
  test('street is not empty', async ({ page }) => {
    const fakePage = new FakeDataPage(page);
    await fakePage.goto();
    await fakePage.generatePerson(COUNT);

    const allStreetTexts = await fakePage.streetValues.allInnerTexts();
    for (const text of allStreetTexts) {
      const { street } = parseStreetLine(text.trim());
      expect(street).not.toBe('');
    }
  });

  test('street contains only alphabetic characters (no digits or special characters)', async ({ page }) => {
    const fakePage = new FakeDataPage(page);
    await fakePage.goto();
    await fakePage.generatePerson(COUNT);

    const allStreetTexts = await fakePage.streetValues.allInnerTexts();
    for (const text of allStreetTexts) {
      const { street } = parseStreetLine(text.trim());
      // Allows Danish letters (æøåÆØÅ) and spaces between words
      expect(street).toMatch(/^[a-zA-ZæøåÆØÅ ]+$/);
    }
  });
});

// ─── Number ──────────────────────────────────────────────────────────────────

test.describe('Address – Number', () => {
  test('number is between 1 and 999 with an optional single uppercase letter', async ({ page }) => {
    const fakePage = new FakeDataPage(page);
    await fakePage.goto();
    await fakePage.generatePerson(COUNT);

    const allStreetTexts = await fakePage.streetValues.allInnerTexts();
    for (const text of allStreetTexts) {
      const { number } = parseStreetLine(text.trim());

      // 1–999, optional trailing uppercase letter, no lowercase/symbols
      expect(number).toMatch(/^[1-9]\d{0,2}[A-Z]?$/);

      const numericPart = parseInt(number, 10);
      expect(numericPart).toBeGreaterThanOrEqual(1);
      expect(numericPart).toBeLessThanOrEqual(999);
    }
  });
});

// ─── Floor ───────────────────────────────────────────────────────────────────

test.describe('Address – Floor', () => {
  test('floor is "st" (ground floor) or a number between 1 and 99', async ({ page }) => {
    const fakePage = new FakeDataPage(page);
    await fakePage.goto();
    await fakePage.generatePerson(COUNT);

    const allStreetTexts = await fakePage.streetValues.allInnerTexts();
    for (const text of allStreetTexts) {
      const { floor } = parseStreetLine(text.trim());

      const isGroundFloor = floor === 'st';
      const floorNum = parseInt(floor, 10);
      const isValidNumber = String(floorNum) === floor && floorNum >= 1 && floorNum <= 99;

      expect(isGroundFloor || isValidNumber).toBe(true);
    }
  });
});

// ─── Door ────────────────────────────────────────────────────────────────────

test.describe('Address – Door', () => {
  test('door is a valid format', async ({ page }) => {
    const fakePage = new FakeDataPage(page);
    await fakePage.goto();
    await fakePage.generatePerson(COUNT);

    const allStreetTexts = await fakePage.streetValues.allInnerTexts();
    for (const text of allStreetTexts) {
      const { door } = parseStreetLine(text.trim());

      // Fixed values
      const isFixedValue = ['th', 'mf', 'tv'].includes(door);

      // Numeric 1–50
      const doorNum = parseInt(door, 10);
      const isNumeric = String(doorNum) === door && doorNum >= 1 && doorNum <= 50;

      // Lowercase letter, optional dash, 1–3 digits (e.g. "c3", "d-14", "a999")
      const isLetterPattern = /^[a-z]-?\d{1,3}$/.test(door);

      expect(isFixedValue || isNumeric || isLetterPattern).toBe(true);
    }
  });
});

// ─── Postal code and town ────────────────────────────────────────────────────

test.describe('Address – Postal code and town', () => {
  test('postal code is exactly 4 digits', async ({ page }) => {
    const fakePage = new FakeDataPage(page);
    await fakePage.goto();
    await fakePage.generatePerson(COUNT);

    const allTownTexts = await fakePage.townValues.allInnerTexts();
    for (const text of allTownTexts) {
      const { postalCode } = parseTownLine(text.trim());
      expect(postalCode).toMatch(/^\d{4}$/);
    }
  });

  test('town name is not empty', async ({ page }) => {
    const fakePage = new FakeDataPage(page);
    await fakePage.goto();
    await fakePage.generatePerson(COUNT);

    const allTownTexts = await fakePage.townValues.allInnerTexts();
    for (const text of allTownTexts) {
      const { townName } = parseTownLine(text.trim());
      expect(townName.trim()).not.toBe('');
    }
  });
});
