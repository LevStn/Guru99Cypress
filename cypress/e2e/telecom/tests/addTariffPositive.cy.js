const URL = "https://demo.guru99.com/telecom/addtariffplans.php";

describe("Add tariff positive", () => {
  let customerId;

  before(() => {
    cy.getValidCustomerId().then((id) => {
      customerId = id;
    });
  });

  beforeEach(() => {
    cy.setCustomCookies("cookies.json");
    cy.log("open page");
    cy.visit("https://demo.guru99.com/telecom/addtariffplans.php");
  });

  it("Maximum valid value", () => {
    const values = [99999, 99999, 9999, 9999, 999, 999, 999];
    cy.insertData(values);
    cy.checkFieldValues(values);
    cy.submitClick();
    cy.url().should("eq", URL);
    cy.checkSuccessMessage("Congratulation you add Tariff Plan");

    cy.get("header.align-center h1")
      .contains("Add Tariff Plans")
      .should("be.visible")
      .should("have.css", "color", "rgb(37, 162, 195)")
      .should("have.css", "text-align", "center");

    cy.checkLogo();

    cy.clickButtonAndVerify("Home");
    cy.contains("Add Tariff Plan to Customer")
      .click()
      .then(() => {
        cy.get("#customer_id").type(customerId);
        cy.get('input[name="submit"]').click();
      });

    cy.get("div.table-wrapper")
      .eq(1)
      .find("table.alt tbody tr")
      .eq(0)
      .find("td")
      .each(($td, index) => {
        const expectedValue = values[index] || "";
        cy.wrap($td).should("have.text", String(expectedValue));
      });
  });

  it("Minimum valid value", () => {
    const values = [1, 0, 0, 0, 0, 0, 0];
    cy.insertData(values);
    cy.checkFieldValues(values);
    cy.submitClick();
    cy.url().should("eq", URL);
    cy.checkSuccessMessage("Congratulation you add Tariff Plan");
  });
});
