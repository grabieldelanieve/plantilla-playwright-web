import { expect, type Locator, type Page } from '@playwright/test';
import { Actions } from '../../main/actions/Actions.js';
import { step } from '../../main/hook/Base.js';

export class FormPage extends Actions {
    readonly $firstnameInput: Locator;
    readonly $lastnameInput: Locator;
    readonly $emailImput: Locator;
    readonly $mobilInput: Locator;
    readonly $dateBirth: Locator;
    readonly $subject: Locator;
    readonly $pictureBtn: Locator;
    readonly $address: Locator;
    readonly $state: Locator;
    readonly $city: Locator;
    readonly $submitBtn: Locator;
    readonly $expectedMsgLabel: Locator;


    constructor(page: Page) {
        super(page);

        this.$firstnameInput = page.getByRole('textbox', { name: 'First Name' });
        this.$lastnameInput = page.getByRole('textbox', { name: 'Last Name' });
        this.$emailImput = page.getByRole('textbox', { name: 'name@example.com' });

        this.$mobilInput = page.getByRole('textbox', { name: 'Mobile Number' });
        this.$dateBirth = page.locator('#dateOfBirthInput');
        this.$subject = page.locator('#subjectsInput');

        this.$pictureBtn = page.locator('#uploadPicture');
        this.$address = page.locator('#currentAddress');
        this.$state = page.locator('#react-select-3-input');
        this.$city = page.locator('#react-select-4-input');

        this.$submitBtn = page.getByRole('button', { name: 'Submit' });
        this.$expectedMsgLabel = page.getByText('Thanks for submitting the form');
    }

    async getstartForm() {
        await this.page.getByRole('heading', { level: 5, name: 'Forms' }).click();
        await expect(this.page).toHaveURL('https://demoqa.com/forms');
        await this.page.getByText('Practice Form').click();
    }

    async fillFullName(firstName: string, lastName: string) {
        await this.$firstnameInput.fill(firstName);
        await this.$lastnameInput.fill(lastName);
    }

    async fillGender(gender: string) {
        const genderLocator: string = `xpath=//label[(text()="${gender}")]`;
        await super.setChecked(genderLocator)
    }

    async fillContactInfo(email: string, mobile: string) {
        await this.$emailImput.fill(email);
        await this.$mobilInput.fill(mobile);
    }

    @step("Recoge la fecha")
    async selectDateOfBirth(month: string, year: string, day: string): Promise<void> {
        await this.$dateBirth.click();

        const getCurrentMonthAndYear = async (): Promise<{ currentMonth: string; currentYear: string }> => {
            // 1️⃣ Esperamos a que el encabezado esté visible
            const headerLocator = this.page.locator('.react-datepicker__header div').first();
            await expect(headerLocator).toBeVisible({ timeout: 5000 });

            // 2️⃣ Leemos el texto (puede ser null)
            const headerText = await headerLocator.textContent();

            if (!headerText) {
                throw new Error('El encabezado del selector de fecha está vacío o no se pudo leer.');
            }

            // 3️⃣ Validamos el formato con regex: "Month Year" (ej. "January 2023")
            const match = headerText.trim().match(/^([A-Za-z]+)\s+(\d{4})$/);
            if (!match) {
                throw new Error(`Formato inesperado en el encabezado de la fecha: "${headerText}"`);
            }

            const [month, year] = headerText.split(' ');

            if (!month || !year) {
                throw new Error('No se pudo obtener el mes o el año actual del calendario');
            }

            return { currentMonth: month, currentYear: year };
        };

        const getNavigationDirection = (targetMonth: string, currentMonth: string): 'Previous Month' | 'Next Month' | null => {
            const direction = this.evaluarMes(targetMonth);
            if (direction === 'previous') return 'Previous Month';
            if (direction === 'next') return 'Next Month';
            return null;
        };

        while (true) {
            const { currentMonth, currentYear } = await getCurrentMonthAndYear();

            if (currentYear !== year) {
                await this.page.locator('.react-datepicker__year-select').click();
                await this.page.locator('.react-datepicker__year-select').selectOption({ label: year });
            }

            if (currentMonth === month) break;

            const direction = getNavigationDirection(month, currentMonth);
            if (!direction) break;

            await this.page.getByRole('button', { name: direction }).click();
        }

        await this.page.locator(`xpath=//div[@role='option' and text()=${day}]`).click();
    }

    async fillSubjects(subjects: string[]) {
        for (const subject of subjects) {
            await this.fillAndEnter(this.$subject, subject);
        }
    }

    async fillHobbies(hobbies: string[]) {
        const checkboxes: string[] = hobbies.map(hobby => `xpath=//label[text()="${hobby}"]`);
        await expect(checkboxes.length).toBe(hobbies.length);
        for (const checkbox of checkboxes) {
            await super.setChecked(checkbox)
        }
    }

    evaluarMes(mes: string): string | null {
        const meses = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const index = meses.findIndex(m => m.toLowerCase() === mes.toLowerCase());

        if (index < 0) {
            throw new Error('Mes no válido');
        }

        if (index < 5) {
            return 'previous';
        } else if (index > 5) {
            return 'next';
        }
        return null;
    }

    uploadPicture(filePath: string): Promise<void> {
        return this.$pictureBtn.setInputFiles(filePath);
    }

    fillAddress(address: string): Promise<void> {
        return this.$address.fill(address);
    }

    async selectStateAndCity(state: string, city: string): Promise<void> {
        await this.fillAndEnter(this.$state, state);
        await this.fillAndEnter(this.$city, city);
    }

    submitForm(): Promise<void> {
        return this.$submitBtn.click();
    }

    async verifySubmission(): Promise<void> {
        await expect(this.$expectedMsgLabel).toBeVisible();
    }

    async fillAndEnter(field: Locator, value: string): Promise<void> {
        await field.fill(value);
        await field.click();
        await field.press('Enter');
    }
}