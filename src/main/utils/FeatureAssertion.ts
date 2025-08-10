
//Locator Assertions
//General Assertions

import { expect, Locator, Page } from '@playwright/test';

export class FeatureAssertion {
  
  constructor(private page: Page) {}

  // =========================
  // 🧩 General Assertions
  // =========================
  
  async assertEqual(
    expected: string | number,
    actual: string | number,
    description: string,
    isSoft: boolean = false
  ) {
    const assertion = isSoft ? expect.soft : expect;
    assertion(
      actual,
      `\n📝 ${description}\n✅ Expected Result: ${expected}\n❌ Obtained Result: ${actual}\n`
    ).toBe(expected);
  }

  async assertContains(
    expectedSubstring: string,
    actualText: string,
    description: string,
    isSoft: boolean = false
  ) {
    const assertion = isSoft ? expect.soft : expect;
    assertion(
      actualText,
      `\n📝 ${description}\n✅ Expected to contain: "${expectedSubstring}"\n❌ Obtained: "${actualText}"\n`
    ).toContain(expectedSubstring);
  }

  async assertNotEqual(
    notExpected: string | number,
    actual: string | number,
    description: string,
    isSoft: boolean = false
  ) {
    const assertion = isSoft ? expect.soft : expect;
    assertion(
      actual,
      `\n📝 ${description}\n✅ Expected different from: ${notExpected}\n❌ Obtained: ${actual}\n`
    ).not.toBe(notExpected);
  }

  // =========================
  // 🎯 Locator Assertions
  // =========================
  
  async assertLocatorVisible(
    locator: Locator,
    description: string,
    isSoft: boolean = false
  ) {
    const isVisible = await locator.isVisible();
    const assertion = isSoft ? expect.soft : expect;
    assertion(
      isVisible,
      `\n📝 ${description}\n✅ Expected: Element visible\n❌ Obtained: Element not visible\n`
    ).toBeTruthy();
  }

  async assertLocatorHasText(
    locator: Locator,
    expectedText: string,
    description: string,
    isSoft: boolean = false
  ) {
    const actualText = await locator.textContent();
    const assertion = isSoft ? expect.soft : expect;
    assertion(
      actualText?.trim(),
      `\n📝 ${description}\n✅ Expected Text: "${expectedText}"\n❌ Obtained Text: "${actualText?.trim()}"\n`
    ).toBe(expectedText);
  }

  async assertLocatorContainsText(
    locator: Locator,
    expectedSubstring: string,
    description: string,
    isSoft: boolean = false
  ) {
    const actualText = await locator.textContent();
    const assertion = isSoft ? expect.soft : expect;
    assertion(
      actualText,
      `\n📝 ${description}\n✅ Expected to contain: "${expectedSubstring}"\n❌ Obtained: "${actualText}"\n`
    ).toContain(expectedSubstring);
  }
}