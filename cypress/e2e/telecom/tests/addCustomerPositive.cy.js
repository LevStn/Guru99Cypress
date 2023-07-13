const SUCCESS_URL = "https://demo.guru99.com/telecom/access.php?uid=";
const BASE_URL = "https://demo.guru99.com/telecom/addcustomer.php";

describe("Add customer positive", () => {
  let validCustomer;
  before(() => {
    cy.readFile("cypress/fixtures/customer.json").then((json) => {
      validCustomer = json;
    });
  });

  beforeEach(() => {
    cy.setCustomCookies("cookies.json");
    cy.log("open page");
    cy.visit(BASE_URL);
  });

  it("Enter valid data whith the radiobutton done", () => {
    let validId;
    cy.get("#done").check({ force: true });
    cy.fillForm(validCustomer);
    cy.checkFormData(validCustomer);
    cy.get('input[type="submit"]').click();

    cy.getCustomerId().then((customerId) => {
      validId = customerId;
      cy.url().should("eq", `${SUCCESS_URL}${customerId}`);
    });

    cy.checkLogo();

    cy.get("h1")
      .should("have.text", "Access Details to Guru99 Telecom")
      .should("exist")
      .should("be.visible")
      .should("have.css", "color", "rgb(37, 162, 195)")
      .should("have.css", "text-align", "center");

    cy.clickButtonAndVerify("Home");

    cy.contains("Add Tariff Plan to Customer")
      .click()
      .then(() => {
        cy.get("#customer_id").type(validId);
        cy.get('input[name="submit"]').click();
      });
    cy.get("font").should("contain", "ACTIVE");
    cy.go("back");
    cy.go("back");

    cy.contains("Pay Billing")
      .click()
      .then(() => {
        cy.get("#customer_id").type(validId);
        cy.get('input[name="submit"]').click();
        cy.contains("Customer ID:-").should("contain.text", `${validId}`);
        cy.contains("Customer Name:-").should(
          "contain.text",
          `${validCustomer.fname}`
        );
      });
  });

  it("Enter valid data whith the radiobutton pending", () => {
    let validId;
    cy.get("#pending").check({ force: true });
    cy.fillForm(validCustomer);
    cy.checkFormData(validCustomer);
    cy.get('input[type="submit"]').click();

    cy.getCustomerId().then((customerId) => {
      validId = customerId;
      cy.url().should("eq", `${SUCCESS_URL}${customerId}`);
    });

    cy.get("a.button").contains("Home").click();
    cy.contains("Add Tariff Plan to Customer")
      .click()
      .then(() => {
        cy.get("#customer_id").type(validId);
        cy.get('input[name="submit"]').click();
      });
    cy.get("font").should("contain", "INACTIVE");
  });
});
