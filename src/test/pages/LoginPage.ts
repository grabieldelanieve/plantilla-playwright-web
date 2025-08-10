import { expect, Locator, Page } from '@playwright/test';
import { Actions } from '../../main/actions/Actions.js';
import { step } from '../../main/hook/Base.js';


export class LoginPage extends Actions {

    readonly $usernameInput: Locator;
    readonly $passwordInput: Locator;
    readonly $submitBtn: Locator;
    readonly $errorMsgLbl: Locator;
    readonly $ProductTltLbl: Locator;

    constructor(page: Page) {
        super(page);

        this.$usernameInput = page.locator('#user-name');
        this.$passwordInput = page.locator('#password');
        this.$submitBtn = page.locator('#login-button');
        this.$errorMsgLbl = page.locator('h3[data-test="error"]');
        this.$ProductTltLbl = page.locator('.product_label');
    }

    async setUsername(username: string): Promise<void> {
        await this.$usernameInput.fill(username);
    }

    async setPassword(password: string): Promise<void> {
        await this.$passwordInput.fill(password);
    }

    async clickSubmit(): Promise<void> {
        await this.$submitBtn.click();
    }

    async verifyLoginSuccess(expectedMessage: string): Promise<void> {
        if (await this.$errorMsgLbl.isVisible()) {
            await expect(this.$errorMsgLbl).toHaveText(expectedMessage);
        } else {
            await expect(this.$ProductTltLbl).toHaveText(expectedMessage);
        }
    }

}