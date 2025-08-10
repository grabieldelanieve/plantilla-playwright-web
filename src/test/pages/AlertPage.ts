import { expect, Locator, Page } from '@playwright/test';
import { Actions } from '../../main/actions/Actions.js';
import { step } from '../../main/hook/Base.js';


export class AlertPage extends Actions {
    
    readonly $alertBtn1: Locator;
    readonly $alertBtn2: Locator;
    readonly $alertBtn4: Locator;
    readonly $confirmResult: Locator;
    readonly $promptResult: Locator;

  constructor(page: Page) {
    super(page);

    this.$alertBtn1 = page.locator("xpath=//span[text()='Click Button to see alert ']/../following-sibling::div/button");
    this.$alertBtn2 = page.locator("xpath=//span[text()='On button click, confirm box will appear']/../following-sibling::div/button");
    this.$alertBtn4 = page.locator("xpath=//span[text()='On button click, prompt box will appear']/../following-sibling::div/button");
    this.$confirmResult = page.locator('#confirmResult');
    this.$promptResult = page.locator('#promptResult');
  }

  
}