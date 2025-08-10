import { test, expect } from '../../main/hook/Base.js';
import { FormPage } from '../pages/FormPage.js';
import * as fs from 'fs';
import { Actions } from '../../main/actions/Actions.js';

const jsonPath = 'src/test/data/Login.json';
const loginData: any = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

test.describe('Login Test Suite', () => {

    for (const [index, data] of loginData.entries()) {
        test(`${data.id} - ${data.description}`, { tag: ['@regression'] },
            async ({ loginPage }) => {
                await loginPage.goto('https://www.saucedemo.com/v1/index.html', 'Swag Labs');
                // await loginPage.goto('https://www.saucedemo.com/', 'Swag Labs');
                await loginPage.setUsername(data.username);
                await loginPage.setPassword(data.password);
                await loginPage.clickSubmit();
                await loginPage.verifyLoginSuccess(data.expectedMessage);
            });
    }

    test.skip('Guardar HTML completo de la página', async ({ page, loginPage }) => {
        // 1️⃣ Navegar a la página
        await loginPage.goto('https://www.saucedemo.com/v1/inventory.html', 'Swag Labs');
        // 2️⃣ Capturar el contenido HTML actual (DOM renderizado)
        const htmlContent = await page.content();
        // 3️⃣ Guardarlo en un archivo
        fs.writeFileSync('page_snapshot.html', htmlContent, { encoding: 'utf-8' });
        console.log('✅ HTML guardado en page_snapshot.html');
    });

});