import { Page } from "@playwright/test";
import { LoginPage } from "./LoginPage";
import { ProductPage } from "./ProductPage";
import { step } from "../../main/hook/Base.js";

export class WebPage {
    private static instance: WebPage | null = null;

    readonly loginPage: LoginPage;
    readonly productPage: ProductPage;

    constructor(private readonly page: Page) {
        this.page = page;
        this.loginPage = new LoginPage(page);
        this.productPage = new ProductPage(page);
    }

    /** No puedo utilizar singleton en esta pagina principal, ya que 
     * cuando se crea una instancia de WebPage,
     * se crea una sola instancia por lo tanto un solo objeto Page.
     * por lo que si inicia con el Page de Login, no puedo utilizar el Page de ProductPage.
     */
    // public static getInstance(page: Page): WebPage {
    //     if (!WebPage.instance) {
    //         WebPage.instance = new WebPage(page);
    //     }
    //     return WebPage.instance;
    // }

    @step('Set credentials to login')
    public async login(username: string, password: string): Promise<void> {
        await this.loginPage.setUsername(username);
        await this.loginPage.setPassword(password);
        await this.loginPage.clickSubmit();
    }

    @step('Add product to cart')
    public async addProductToCart(productName: string): Promise<void> {
        const title = await this.productPage.getProductTitle(productName);
        const description = await this.productPage.getProductDescription(productName);
        const price = await this.productPage.getProductPrice(productName);
        await this.productPage.addToCart(productName);
    }
}

export { FormPage } from './FormPage.js';
export { AlertPage } from './AlertPage.js';
export { LoginPage } from './LoginPage.js';