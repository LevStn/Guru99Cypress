const URL = "https://demo.guru99.com/telecom/billing.php";
let customerIdValue;
const validCustomer = {
  fname: "John",
  lname: "Doe",
  email: "test@test.com",
  message: "This is my address",
  telephoneno: "1234567890",
};

describe("Pay Billing", () => {
  before(() => {
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
    cy.getCustomerId().then((customerId) => {
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

  it.skip("Valid client entered", () => {
    cy.get("#customer_id").should("be.visible").type(customerIdValue);
    cy.get("#customer_id").should("have.value", customerIdValue);
    cy.get('[name="submit"]').should("be.visible").click();
    cy.url().should("eq", URL);
    cy.contains("Customer ID:-")
      .should("be.visible")
      .should("contain.text", customerIdValue);
    cy.contains("Customer Name:-")
      .should("be.visible")
      .should("contain.text", validCustomer.fname);
  });

  it("Input field validation check customerId", () => {
    const ErrorMessages = [
      "Special characters are not allowed",
      "Characters are not allowed",
      "Number must not be blank",
    ];

    const invalidIds = ["&%%", "AAA", ""];

    invalidIds.forEach((id, index) => {
      cy.get("#customer_id")
        .clear()
        .type(id || "{backspace}");
      cy.get("#customer_id").should("have.value", id);
      cy.get("label#message2")
        .should("be.visible")
        .should("contain", ErrorMessages[index]);
      cy.submitClick();
    });
  });

  it("Сheck valid length ", () => {
    const validValues = ["1", `${"1".repeat(255)}`];

    validValues.forEach((id) => {
      cy.get("#customer_id").clear().type(id);
      cy.get("#customer_id").should("have.value", id);
      cy.get("label#message2");
      cy.get("#message2").should("not.be.visible");
      cy.get('[name="submit"]').click();
      cy.url().should("eq", URL);

      if (cy.contains("Please Input Your Correct Customer ID")) {
      }
      cy.contains("Please Input Your Correct Customer ID").then(($element) => {
        if ($element.is(":visible")) {
          cy.get('a.button[href="billing.php"]').should("be.visible").click();
        } else {
          cy.contains("Customer ID:-");
          cy.go("back");
        }
      });
    });
  });

  it("Сheck invalid max length ", () => {
    const invalidLength = `${"1".repeat(256)}`;

    cy.get("#customer_id").clear().type(invalidLength);
    cy.get("#customer_id").should("have.value", `${"1".repeat(255)}`);
  });
});
