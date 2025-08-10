import { test, expect } from '../../main/hook/Base.js';
import * as fs from 'fs';
import { RepositoryConfig as config } from '../../main/repository/RepositoryConfig';

const jsonPath = 'src/test/data/Product.json';
const loginData: any = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));


test.describe('Example Test Suite', () => {

    for (const [index, item] of loginData.entries()) {
        test(`Add products to cart - data set #${index + 1}`, { tag: ['@sanity, @smoke'] },
            async ({ webPage }) => {
                await webPage.loginPage.goto(config.swagglabUrl, config.titleSwagglab);
                await webPage.login(item.username, item.password);

                for (const product of item.products) {
                    await webPage.addProductToCart(product.title);
                }
            });
    }

    for (const [index, item] of loginData.entries()) {
        test(`Validate cart counter - data set #${index + 1}`, { tag: ['@sanity, @smoke'] },
            async ({ webPage, productPage }) => {
                await webPage.loginPage.goto(config.swagglabUrl, config.titleSwagglab);
                await webPage.login(item.username, item.password);
                for (const product of item.products) {
                    await webPage.addProductToCart(product.title);
                }

                productPage.isVisible(webPage.productPage.$cartIcon);

                const cartCounter = await productPage.getCartcounter();
                const expectedCount = item.products.length.toString();
                expect(cartCounter).toBe(expectedCount);
            });
    }
});