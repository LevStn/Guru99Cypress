Cypress.Commands.add("verifyCardDetails", (card) => {
  cy.log(`Verifying card number:${card.number}`);
  cy.get("#card_nmuber").should("have.value", card.number);
  cy.log(`Verifying card month:${card.month}`);
  cy.get("#month").should("have.value", card.month);
  cy.log(`Verifying card year:${card.year}`);
  cy.get("#year").should("have.value", card.year);
  cy.log(`Verifying card cvv:${card.cvv}`);
  cy.get("#cvv_code").should("have.value", card.cvv);
});

Cypress.Commands.add("fillPaymentDetails", (card) => {
  cy.log(`Input card number:${card.number}`);
  if (card.number) {
    cy.get("#card_nmuber").type(card.number);
  } else {
    cy.get("#card_nmuber").clear();
  }

  cy.log(`Select expiration month:${card.month}`);
  cy.get("#month").select(card.month);
  cy.log(`Select expiration year:${card.year}`);
  cy.get("#year").select(card.year);

  cy.log(`Input card cvv:${card.cvv}`);
  if (card.cvv) {
    cy.get("#cvv_code").type(card.cvv);
  } else {
    cy.get("#cvv_code").clear();
  }
});

Cypress.Commands.add("checkCardError", (selector, expectedText) => {
  cy.log(`Check error in ${selector}, message: ${expectedText}`);
  cy.get(selector).should("be.visible").should("contain", expectedText);
});
