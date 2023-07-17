Cypress.Commands.add("ValidateCustomerID", (id, expectedErrorMessage) => {
  cy.log(`Validate customer invalid id:${id}, error:${expectedErrorMessage}`);
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
  cy.log(`Submit customer id:${customerId}`);
  cy.get("#customer_id").clear().type(customerId);
  cy.get("#customer_id").should("have.value", customerId);
  cy.get("label#message2");
  cy.get("#message2").should("not.be.visible");
  cy.get('[name="submit"]').click();
});
