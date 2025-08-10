import { test, expect } from '../../main/hook/Base.js';
import { FormPage } from '../pages/FormPage.js';
import * as fs from 'fs';
import { Actions } from '../../main/actions/Actions.js';

const jsonPath = 'src/test/data/Form.json';
const loginData: any = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));


test.describe('Example Test Suite', () => {

  for (const [index, data] of loginData.entries()) {
    test(`Complete the form - data set #${index + 1}`, { tag: ['@sanity, @smoke'] },
      async ({ formPage }) => {
        await formPage.goto('https://demoqa.com/', 'DEMOQA');
        await formPage.getstartForm();
        await formPage.fillFullName(data.firstName, data.lastName);
        await formPage.fillContactInfo(data.email, data.phone);
        await formPage.fillGender(data.gender);
        await formPage.selectDateOfBirth(data.dateOfBirth.month, data.dateOfBirth.year, data.dateOfBirth.day);
        await formPage.fillSubjects(data.subjects);
        await formPage.fillHobbies(data.hobbies);
        await formPage.uploadPicture(data.picture);
        await formPage.fillAddress(data.address);
        await formPage.selectStateAndCity(data.state, data.city);
        await formPage.submitForm();
        await formPage.verifySubmission();
      });
  }

  test('Ok - Dialog - Alert', { tag: ['@sanity'] },
    async ({ alertPage }) => {
      await alertPage.navigate('https://demoqa.com/alerts');
      await alertPage.acceptAlert('You clicked a button', alertPage.$alertBtn1);
    });

  test('Confirm - Dialog', { tag: ['@sanity'] },
    async ({ alertPage }) => {
      await alertPage.navigate('https://demoqa.com/alerts');
      await alertPage.confirmAlert('Do you confirm action?', true, alertPage.$alertBtn2);
    });

  test('Prompt - Dialog', { tag: ['@sanity'] },
    async ({ alertPage }) => {
      await alertPage.navigate('https://demoqa.com/alerts');
      await alertPage.promptDialog('Please enter your name', 'Grabiel De La Nieve', true, alertPage.$alertBtn4);
    });

  test('Validate Frames', { tag: ['@sanity'] },
    async ({ page }) => {
      const actions: Actions = new Actions(page);
      await actions.navigate('https://ui.vision/demo/webtest/frames/');

      const frame = await actions.getFrameByURL('https://ui.vision/demo/webtest/frames/frame_1.html');
      await expect(frame.locator('[name="mytext1"]')).toBeVisible();
      await frame.locator('[name="mytext1"]').fill('This is a test');

      const frame2 = await actions.getFrameByLocator("[src='frame_3.html']");
      await expect(frame2.locator('[name="mytext3"]')).toBeVisible();
      await frame2.locator('[name="mytext3"]').fill('This is another test');

    });


  test.skip('Visual Testing', { tag: ['@sanity'] }, async ({ page }) => {
    const formPage = new FormPage(page);
    await formPage.goto('https://demoqa.com/');
    await formPage.getstartForm();
  });

  

});
