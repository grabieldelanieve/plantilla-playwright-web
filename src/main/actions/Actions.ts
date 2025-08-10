import { test, expect } from '@playwright/test';
import type { Locator, Page, Frame, FrameLocator } from '@playwright/test';
import { AlertType } from '../Enum/Constants.js';

export class Actions {
    protected readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goto(url: string, title: string = ''): Promise<void> {
        await this.page.goto(url);
    
        if (title === '') {
            await expect(this.page).toHaveTitle(title);
        }
    }

    async click(selector: string): Promise<void> {
        await this.page.click(selector);
    }

    async setChecked(selector: string): Promise<void> {
        const radioLocator: Locator = this.page.locator(selector);
        if (!(await radioLocator.isChecked())) {
            await radioLocator.click();
            await expect(radioLocator).toBeChecked();
        }
    }

    async fill(selector: string, value: string): Promise<void> {
        await this.page.fill(selector, value);
    }

    async waitForSelector(selector: string): Promise<void> {
        await this.page.waitForSelector(selector);
    }

    async navigate(url: string): Promise<void> {
        await this.page.goto(url);
    }

    async acceptAlert(message: string, locator: Locator): Promise<void> {
        this.page.on('dialog', async dialog => {
            expect(dialog.type()).toBe(AlertType.ALERT);
            expect(dialog.message()).toBe(message);
            await dialog.accept();
        });
        await locator.click(); // Click the button that triggers the alert!!
    }

    async dismissAlert(message: string, locator: any) {
        await this.page.locator(locator).click();
        await this.page.on('dialog', async (dialog: any) => {
            expect(dialog.message()).toBe(message);
            await dialog.dismiss();
        });
    }

    async confirmAlert(message: string, accept: boolean = true, locator: Locator): Promise<void> {
        const choice = (accept) ? 'Ok' : 'Cancel';
        this.page.on('dialog', async dialog => {
            expect(dialog.type()).toBe(AlertType.CONFIRM);
            expect(dialog.message()).toBe(message);
            if (accept) {
                await dialog.accept();
            } else {
                await dialog.dismiss();
            }
        });
        await locator.click(); // Click the button that triggers the alert!!
        await expect(this.page.locator('#confirmResult')).toHaveText(`You selected ${choice}`);
    }

    async promptDialog(message: string, inputValue: string = '', accept: boolean = true, locator: Locator): Promise<void> {
        this.page.on('dialog', async dialog => {
            expect(dialog.type()).toBe(AlertType.PROMPT);
            expect(dialog.message()).toBe(message);
            // expect(dialog.defaultValue()).toBe(inputValue);
            if (accept) {
                await dialog.accept(inputValue);
            } else {
                await dialog.dismiss();
            }
        });
        await locator.click(); // Click the button that triggers the alert!!
        await expect(this.page.locator('#promptResult')).toHaveText(`You entered ${inputValue}`);
    }

    async getFrameByURL(frameURL: string): Promise<Frame> {
        const frame = this.page.frame({ url: frameURL });
        // If the frame is not found, throw an error
        if (!frame) {
            throw new Error(`Frame with URL ${frameURL} not found`);
        }
        return frame;
    }

    async getFrameByLocator(locator: string): Promise<FrameLocator> {
        const frameElement = this.page.frameLocator(locator);
        // If the frame is not found, throw an error
        if (!frameElement) {
            throw new Error(`Frame with locator ${locator} not found`);
        }
        return frameElement;
    }

    async getFrameCount(): Promise<number> {
        const frames = this.page.frames();
        expect(frames.length).toBeGreaterThan(0);
        return frames.length;
    }

    async waitByIntervals(locator: Locator, flag: boolean,
        itvals: number[] = [1_000, 2_000, 10_000], timeOt: number = 60_000): Promise<void> {

        await expect(async () => {
            if (flag) expect(locator).toBeVisible();
            else expect(locator).not.toBeVisible();
        }).toPass({
            // Probe, wait 1s, probe, wait 2s, probe, wait 10s, probe, wait 10s, probe
            // ... Defaults to [100, 250, 500, 1000].
            intervals: itvals,
            timeout: timeOt
        });
    }

    async isVisible(locator: Locator): Promise<boolean> {
        const isVisible = await locator.isVisible();
        if (!isVisible) {
            throw new Error(`Element with selector ${locator} is not visible`);
        }
        return isVisible;
    }
}