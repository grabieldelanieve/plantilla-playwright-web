import test, { expect, Locator, Page } from '@playwright/test';
import { Actions } from '../../main/actions/Actions.js';


export class ProductPage extends Actions {

    readonly $base_xpath: string;
    readonly $cartCounter: Locator;
    readonly $cartIcon: Locator;

    constructor(page: Page) {
        super(page);

        
        this.$base_xpath = `xpath=//div[@class='inventory_item_name'`;
        this.$cartCounter = page.locator(`xpath=//span[@class='fa-layers-counter shopping_cart_badge']`);
        this.$cartIcon = page.locator(`xpath=//a[@class='shopping_cart_link fa-layers fa-fw']`);
    }

    async getProductTitle(title: string): Promise<string> {
        const $locator = await this.page.locator(`${this.$base_xpath} and text()='${title}']`);
        return await $locator.textContent() || '';
    }

    async getProductDescription(title: string): Promise<string> {
        const $locator = await this.page.locator(`${this.$base_xpath} and text()='${title}']/../following-sibling::div`);
        return await $locator.textContent() || '';
    }

    async getProductPrice(title: string): Promise<string> {
        const $locator = this.page.locator(`${this.$base_xpath} and text()='${title}']/../../following-sibling::div/div`);
        return await $locator.textContent() || '';
    }

    async addToCart(title: string): Promise<void> {
        const $locator = this.page.locator(`${this.$base_xpath} and text()='${title}']/../../following-sibling::div/button`);
        await test.step(`Add product ${title} to cart`, async () => {
            await $locator.click();
            await expect($locator).toHaveText('REMOVE');
        });
    }

    async getCartcounter(): Promise<string> {
        return await test.step('Get cart counter', async () => {
            return await this.$cartCounter.textContent() || '';
        });
    }

    async clickToCartIcon(): Promise<void> {
        await test.step('Click on cart icon', async () => {
            await this.$cartIcon.click();
            await expect(this.$cartIcon).toBeVisible();
        });
    }

}