const URL = "https://demo.guru99.com/telecom/billing.php";

describe("Pay Billing", () => {
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

  it("Element Presence check on Pay Billing", () => {
    cy.get("header.align-center h1")
      .contains("Pay Billing")
      .should("have.css", "color", "rgb(37, 162, 195)")
      .should("have.css", "text-align", "center");

    cy.get("div.4u.12u\\$\\(small\\) h3")
      .contains("Enter Your Customer ID")
      .should("have.css", "text-align", "center")
      .should("have.css", "color", "rgb(37, 162, 195)");

    cy.get("#customer_id")
      .should("be.visible")
      .should("have.attr", "placeholder", "Enter Your Customer ID");

    cy.checkLogo();

    cy.get('input[type="submit"]')
      .should("be.visible")
      .should("have.css", "background-color", "rgb(246, 117, 94)")
      .should("have.css", "color", "rgb(255, 255, 255)")
      .should("have.css", "text-align", "center");
  });

  it("Input field validation check customerId", () => {
    const ErrorMessages = [
      "Special characters are not allowed",
      "Characters are not allowed",
      "Number must not be blank",
    ];

    const invalidIds = ["&%%", "AAA", ""];

    invalidIds.forEach((id, index) => {
      cy.ValidateCustomerID(id, ErrorMessages[index]);
    });
  });

  it("Сheck valid length ", () => {
    const validValues = ["1", `${"1".repeat(255)}`];

    validValues.forEach((id) => {
      cy.typeAndSubmitCustomerId(id);

      cy.url().should("eq", URL);

      if (cy.contains("Please Input Your Correct Customer ID")) {
        cy.get('a.button[href="billing.php"]').should("be.visible").click();
      } else {
        cy.contains("Customer ID:-");
        cy.go("back");
      }
    });
  });

  it("Сheck invalid max length ", () => {
    const invalidLength = `${"1".repeat(256)}`;

    cy.get("#customer_id").clear().type(invalidLength);
    cy.get("#customer_id").should("have.value", `${"1".repeat(255)}`);
  });
});
