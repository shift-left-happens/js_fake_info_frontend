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
}
