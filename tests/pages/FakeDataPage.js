export class FakeDataPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Form controls
    this.personRadio = page.locator('#chkPerson');
    this.partialRadio = page.locator('#chkPartialOptions');
    this.personCount = page.locator('#txtNumberPersons');
    this.partialOptionsDropdown = page.locator('#cmbPartialOptions');
    this.generateButton = page.getByRole('button', { name: 'Generate' });

    // Output section
    this.output = page.locator('#output');
    this.personCards = page.locator('.personCard');

    // Person card fields
    this.cprValues = page.locator('.cprValue');
    this.firstNameValues = page.locator('.firstNameValue');
    this.lastNameValues = page.locator('.lastNameValue');
    this.genderValues = page.locator('.genderValue');
    this.dobValues = page.locator('.dobValue');
    this.streetValues = page.locator('.streetValue');
    this.townValues = page.locator('.townValue');
    this.phoneNumberValues = page.locator('.phoneNumberValue');
  }

  async goto() {
    await this.page.goto('/');
  }

  async generatePerson(count = 1) {
    await this.personRadio.check();
    if (count !== 1) {
      await this.personCount.fill(String(count));
    }
    await this.generateButton.click();
  }

  async generatePartial(option) {
    await this.partialRadio.check();
    await this.partialOptionsDropdown.selectOption(option);
    await this.generateButton.click();
  }

  // Extracts day, month and 2-digit year from the first 6 digits of a CPR number (DDMMYY)
  extractCprBirthParts(cprText) {
    const cpr = cprText.trim();
    return {
      day: parseInt(cpr.substring(0, 2), 10),
      month: parseInt(cpr.substring(2, 4), 10),
      yearShort: parseInt(cpr.substring(4, 6), 10),
    };
  }

  // Returns true if CPR birth parts (DDMMYY) match a displayed DOB (YYYY-MM-DD)
  cprDateMatchesDob(cprText, dobText) {
    const { day, month, yearShort } = this.extractCprBirthParts(cprText);
    const [year, dobMonth, dobDay] = dobText.trim().split('-').map(Number);
    return day === dobDay && month === dobMonth && year % 100 === yearShort;
  }
}
