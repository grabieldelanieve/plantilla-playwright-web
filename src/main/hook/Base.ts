import { test as base } from '@playwright/test';
import { FormPage } from '../../test/pages/FormPage.js';
import { AlertPage } from '../../test/pages/AlertPage.js';
import { LoginPage } from '../../test/pages/LoginPage.js';

import type { Page } from '@playwright/test';
import { ProductPage } from '../../test/pages/ProductPage.js';
import { WebPage } from '../../test/pages/WebPage.js';

interface ErrorRequest {
    url: string;
    status: number;
}

export const test = base.extend<{
    // Fixtures form POM Objects
    webPage: WebPage,
    formPage: FormPage,
    alertPage: AlertPage,
    loginPage: LoginPage,
    productPage: ProductPage,
    // Fixtures for page and actions
    timeLogger: void,
    exceptionLogger: void,
    networkErrorMonitor: Page
}>({
    // You can add custom fixtures here if needed
    webPage: async ({ page }, use) => {
        await use(new WebPage(page));
    },
    formPage: async ({ page }, use) => {
        await use(new FormPage(page));
    },
    alertPage: async ({ page }, use) => {
        await use(new AlertPage(page));
    },
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    productPage: async ({ page }, use) => {
        await use(new ProductPage(page));
    },
    page: async ({ page }, use) => {

        // -- Before each test ---

        /**  Esto permite que mis pruebas no fallen por el anuncio de ads,
        al utilizar mi "exceptionLogger" */
        await page.route('**/adplus.js', route => route.abort());

        await use(page);

        // -- After each test ---
    },
    timeLogger: [async ({ }, use) => {
        test.info().annotations.push({
            type: 'Start',
            description: `Starting test at ${new Date().toLocaleTimeString()}`
        });

        await use();

        test.info().annotations.push({
            type: 'End',
            description: `Ending test at ${new Date().toLocaleTimeString()}`
        });
    }, { auto: true }],
    exceptionLogger: [async ({ page }, use) => {
        const errors: Error[] = [];
        page.on('pageerror', (exception) => {
            errors.push(exception);
        });

        await use();

        if (errors.length > 0) {
            await test.info().attach('fronted-exceptions', {
                body: errors
                    .map(error => `${error.message}\n${error.stack}`)
                    .join("\n-----\n"),
                contentType: 'text/plain',
            });
            throw new Error(`There were ${errors.length} exceptions during the test execution.`);
        }
    }, { auto: true }],
    networkErrorMonitor: [
        async ({ page }, use, testInfo) => {
            const errorData: ErrorRequest[] = [];

            page.on("response", async (response) => {
                const url = response.url();
                const status = response.status();

                if (status >= 400) {
                    const errorRequest: ErrorRequest = {
                        url,
                        status,
                    };

                    errorData.push(errorRequest);
                }
            });

            await use(page);

            if (errorData.length > 0) {
                await testInfo.attach("error-requests.json", {
                    body: JSON.stringify(errorData, null, 2),
                    contentType: "application/json",
                });

                throw new Error(
                    `Network errors detected: ${errorData.length} requests failed. Check the attached error-requests.json`
                );
            }
        },
        { auto: true }],
})

export { expect } from '@playwright/test';

/**
 * Decorator function for wrapping POM methods in a test.step.
 *
 * Use it without a step name `@step()`.
 *
 * Or with a step name `@step("Search something")`.
 *
 * @param stepName - The name of the test step.
 * @returns A decorator function that can be used to decorate test methods.
 */
export function step(stepName?: string, p0?: () => Promise<void>) {
    return function decorator(
        target: Function,
        context: ClassMethodDecoratorContext
    ) {
        return function replacementMethod(...args: any) {
            const name = `${stepName || (context.name as string)} (${this.constructor.name})`
            return test.step(name, async () => {
                return await target.call(this, ...args)
            })
        }
    }
}