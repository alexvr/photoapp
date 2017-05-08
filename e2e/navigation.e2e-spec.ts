import {browser, element, by} from "protractor";
describe('navigation', () => {
  let baseURL = 'http://localhost:4200';

  beforeEach(() => {
    browser.get('/');
    /*let inputMail = element(by.id('username'));
     let inputPass = element(by.id('password'));
     let btnLogin = element(by.id('login'));

     inputMail.sendKeys("runtrackminds2017@gmail.com");
     inputPass.sendKeys("Team102017");

     btnLogin.click().then(() => {
     browser.driver.sleep(2000);
     });*/
  });

  let addEventBtn = element(by.id('addEvent-btn'));
  let basicInfoBtn = element(by.id('basic-info'));
  let mediaSettingsBtn = element(by.id('media-settings'));
  let layoutBtn = element(by.id('layout'));
  let backBtn = element(by.id('back-btn'));
  let saveEventBtn = element(by.id('save-event-btn'));

  it('add-event button should show basic-info page (configuration)', () => {
    addEventBtn.click().then(() => {
      browser.driver.sleep(2000);
      expect(browser.getCurrentUrl()).toBe(baseURL + '/configuration/basic-info');
    });
  });

  it('media-settings button should show media-settings page (configuration)', () => {
    addEventBtn.click().then(() => {
      browser.driver.sleep(2000);
      expect(browser.getCurrentUrl()).toBe(baseURL + '/configuration/basic-info');
      mediaSettingsBtn.click().then(() => {
        browser.driver.sleep(2000);
        expect(browser.getCurrentUrl()).toBe(baseURL + '/configuration/media-settings');
      });
    });
  });

  it('layout button should show layout page (configuration)', () => {
    addEventBtn.click().then(() => {
      browser.driver.sleep(2000);
      expect(browser.getCurrentUrl()).toBe(baseURL + '/configuration/basic-info');
      layoutBtn.click().then(() => {
        browser.driver.sleep(2000);
        expect(browser.getCurrentUrl()).toBe(baseURL + '/configuration/layout');
      });
    });
  });

  it('basic-info button should show basic-info page (configuration)', () => {
    addEventBtn.click().then(() => {
      browser.driver.sleep(2000);
      expect(browser.getCurrentUrl()).toBe(baseURL + '/configuration/basic-info');
      basicInfoBtn.click().then(() => {
        browser.driver.sleep(2000);
        expect(browser.getCurrentUrl()).toBe(baseURL + '/configuration/basic-info');
      });
    });
  });

  it('back button should show event-overview page', () => {
    addEventBtn.click().then(() => {
      browser.driver.sleep(2000);
      expect(browser.getCurrentUrl()).toBe(baseURL + '/configuration/basic-info');
      backBtn.click().then(() => {
        browser.driver.sleep(2000);
        expect(browser.getCurrentUrl()).toBe(baseURL + '/event-overview');
      });
    });
  });

  it('save-event button should show event-overview page', () => {
    addEventBtn.click().then(() => {
      browser.driver.sleep(2000);
      expect(browser.getCurrentUrl()).toBe(baseURL + '/configuration/basic-info');
      saveEventBtn.click().then(() => {
        browser.driver.sleep(2000);
        expect(browser.getCurrentUrl()).toBe(baseURL + '/event-overview');
      });
    });
  });
});
