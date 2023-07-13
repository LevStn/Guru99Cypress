const validCustomer = require("../fixtures/customer.json");

Cypress.Commands.add("setCustomCookies", (cookieFileName) => {
  cy.fixture(cookieFileName).then((cookies) => {
    cookies.forEach((cookie) => {
      cy.setCookie(cookie.name, cookie.value);
    });
  });
});

Cypress.Commands.add("getValidCustomerId", () => {
  cy.fixture("cookies.json").then((cookies) => {
    cookies.forEach((cookie) => {
      cy.setCookie(cookie.name, cookie.value);
    });
  });
  cy.log("open add customer");
  cy.visit("https://demo.guru99.com/telecom/addcustomer.php");

  cy.get("#done").check({ force: true });
  cy.fillForm(validCustomer);
  cy.get('input[type="submit"]').click();

  return cy.getCustomerId().then((customerId) => {
    return customerId;
  });
});
