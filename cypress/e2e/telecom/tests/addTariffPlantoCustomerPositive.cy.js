const URL = "https://demo.guru99.com/telecom/assigntariffplantocustomer.php";

describe("Pay Billing positive", () => {
  let customerIdValue;
  before(() => {
    cy.getValidCustomerId().then((customerId) => {
      customerIdValue = customerId;
    });
  });

  beforeEach(() => {
    cy.setCustomCookies("cookies.json");
    cy.log("open page");
    cy.visit(`${URL}`);
  });

  it("Valid client entered", () => {
    cy.get("#customer_id").should("be.visible").type(customerIdValue);
    cy.get("#customer_id").should("have.value", customerIdValue);
    cy.get('[name="submit"]').should("be.visible").click();
    cy.url().should("eq", URL);

    cy.log("Checking label Approved Tariff Plan");
    cy.contains("Approved Tariff Plans")
      .should("be.visible")
      .should("have.css", "color", "rgb(37, 162, 195)");
    cy.get("tr").should("exist");

    cy.log("Checking label Unapproved Tariff Plans");
    cy.contains("Unapproved Tariff Plans")
      .should("be.visible")
      .should("have.css", "color", "rgb(37, 162, 195)");

    cy.log("Checking button Submit");
    cy.get('input[type="submit"]')
      .should("be.visible")
      .should("have.css", "background-color", "rgb(246, 117, 94)")
      .should("have.css", "color", "rgb(255, 255, 255)")
      .should("have.css", "text-align", "center")
      .click();

    cy.url().should(
      "eq",
      "https://demo.guru99.com/telecom/inserttariffplantocustomer.php"
    );

    cy.contains("Congratulation Tariff Plan assigned").should("be.visible");
    cy.get('a.button[href="index.html"]').should("be.visible").click();

    cy.url().should("eq", "https://demo.guru99.com/telecom/index.html");
  });
});
