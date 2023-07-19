const SUCCESS_URL =
  "https://demo.guru99.com/payment-gateway/genearte_orderid.php?uid=";

describe("Payment geteway positive", () => {
  let validCards;

  before(() => {
    cy.log("Getting valid cards");
    cy.readFile("cypress/fixtures/validCards.json").then((json) => {
      validCards = json;
    });
  });

  beforeEach(() => {
    cy.setCustomCookies("cookies.json");
    cy.log("Open page select quantity");
    cy.visit("https://demo.guru99.com/payment-gateway/index.php");
    cy.get('input[type="submit"]').click();
  });

  it("Сorrect payment from valid banks", () => {
    Object.keys(validCards).forEach((bank, index) => {
      const card = validCards[bank];

      cy.fillPaymentDetails(card);
      cy.verifyCardDetails(card);
      cy.get('input[type="submit"]').click();
      cy.wait(2000);
      cy.get("h3 strong")
        .invoke("text")
        .then((text) => {
          const orderId = text.match(/\d+/g).join("");
          const expectedUrl = `${SUCCESS_URL}${orderId}`;
          cy.url().should("eq", expectedUrl);
        });

      if (index !== Object.keys(validCards).length - 1) {
        cy.visit("https://demo.guru99.com/payment-gateway/index.php");
        cy.get('input[type="submit"]').click();
      }
    });
    cy.get(".table-wrapper h2")
      .contains("Payment successfull!")
      .should("have.css", "color", "rgb(85, 85, 85)");
  });
});
