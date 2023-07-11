const validCustomer = require("../fixtures/customer.json");

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

Cypress.Commands.add("ValidateCustomerID", (id, expectedErrorMessage) => {
  cy.get("#customer_id")
    .clear()
    .type(id || "{backspace}");
  cy.get("#customer_id").should("have.value", id);
  cy.get("label#message2")
    .should("be.visible")
    .should("contain", expectedErrorMessage);
  cy.submitClick();
});

Cypress.Commands.add("typeAndSubmitCustomerId", (customerId) => {
  cy.get("#customer_id").clear().type(customerId);
  cy.get("#customer_id").should("have.value", customerId);
  cy.get("label#message2");
  cy.get("#message2").should("not.be.visible");
  cy.get('[name="submit"]').click();
});
