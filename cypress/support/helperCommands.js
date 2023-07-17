const validCustomer = require("../fixtures/customer.json");

Cypress.Commands.add("setCustomCookies", (cookieFileName) => {
  cy.log("Set custom cookies");
  cy.fixture(cookieFileName).then((cookies) => {
    cookies.forEach((cookie) => {
      cy.setCookie(cookie.name, cookie.value);
    });
  });
});

Cypress.Commands.add("getValidCustomerId", () => {
  cy.setCustomCookies("cookies.json");
  cy.log("open add customer");
  cy.visit("https://demo.guru99.com/telecom/addcustomer.php");

  cy.get("#done").check({ force: true });
  cy.fillForm(validCustomer);
  cy.get('input[type="submit"]').click();

  return cy.getCustomerId().then((customerId) => {
    return customerId;
  });
});
