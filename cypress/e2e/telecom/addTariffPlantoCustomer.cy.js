const URL = "https://demo.guru99.com/telecom/assigntariffplantocustomer.php";
let customerIdValue;

describe("Pay Billing", () => {
  before(() => {
    cy.getValidCustomerId().then((customerId) => {
      customerIdValue = customerId;
    });
  });

  beforeEach(() => {
    cy.fixture("cookies.json").then((cookies) => {
      cookies.forEach((cookie) => {
        cy.setCookie(cookie.name, cookie.value);
      });
    });
    cy.log("open page");
    cy.visit(`${URL}`);
  });

  it("Valid client entered", () => {
    cy.get("#customer_id").should("be.visible").type(customerIdValue);
    cy.get("#customer_id").should("have.value", customerIdValue);
    cy.get('[name="submit"]').should("be.visible").click();
    cy.url().should("eq", URL);
    cy.contains("Approved Tariff Plans").should("be.visible");
    cy.get("tr").should("exist");

    cy.contains("Unapproved Tariff Plans").should("be.visible");
    cy.get('input[type="submit"]').should("be.visible").click();
    cy.url().should(
      "eq",
      "https://demo.guru99.com/telecom/inserttariffplantocustomer.php"
    );

    cy.contains("Congratulation Tariff Plan assigned").should("be.visible");
    cy.get('a.button[href="index.html"]').should("be.visible").click();

    cy.url().should("eq", "https://demo.guru99.com/telecom/index.html");
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
        cy.get('a.button[href="assigntariffplantocustomer.php"]').click();
      } else {
        cy.contains("Unapproved Tariff Plans");
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