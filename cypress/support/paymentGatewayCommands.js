Cypress.Commands.add("verifyCardDetails", (card) => {
  cy.get("#card_nmuber").should("have.value", card.number);
  cy.get("#month").should("have.value", card.month);
  cy.get("#year").should("have.value", card.year);
  cy.get("#cvv_code").should("have.value", card.cvv);
});

Cypress.Commands.add("fillPaymentDetails", (card) => {
  if (card.number) {
    cy.get("#card_nmuber").type(card.number);
  } else {
    cy.get("#card_nmuber").clear();
  }

  cy.get("#month").select(card.month);
  cy.get("#year").select(card.year);

  if (card.cvv) {
    cy.get("#cvv_code").type(card.cvv);
  } else {
    cy.get("#cvv_code").clear();
  }
});

Cypress.Commands.add("checkCardError", (selector, expectedText) => {
  cy.get(selector).should("be.visible").should("contain", expectedText);
});
