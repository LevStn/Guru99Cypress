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

  it("Valid client entered", () => {
    cy.get("#customer_id").should("be.visible").type(customerIdValue);
    cy.get("#customer_id").should("have.value", customerIdValue);
    cy.get('[name="submit"]').should("be.visible").click();
    cy.url().should("eq", URL);

    cy.get("header.align-center h1")
      .contains("Pay Billing")
      .should("have.css", "color", "rgb(37, 162, 195)")
      .should("have.css", "text-align", "center");

    cy.contains("Customer ID:-")
      .should("be.visible")
      .should("contain.text", customerIdValue)
      .should("have.css", "color", "rgb(37, 162, 195)");
    cy.contains("Customer Name:-")
      .should("be.visible")
      .should("contain.text", "John")
      .should("have.css", "color", "rgb(37, 162, 195)");
    cy.checkLogo();

    const expectedValues = [
      ["Local Minutes", "200", "220", "20", "50"],
      ["International Minutes", "100", "110", "10", "200"],
      ["SMS Pack", "500", "400", "0", "0"],
      ["Tariff Plan Amount", "", "", "", "500"],
      ["Usage Charges", "", "", "", "250"],
      ["Total Bill", "", "", "", "750"],
    ];

    cy.get("div.table-wrapper table.alt tbody tr").each(($row, rowIndex) => {
      cy.wrap($row)
        .find("td")
        .each(($td, columnIndex) => {
          const cellText = $td.text().trim();
          if (cellText !== "" && expectedValues[rowIndex][columnIndex] !== "") {
            const expectedValue = expectedValues[rowIndex][columnIndex];
            expect(cellText).to.eq(expectedValue);
          }
        });
    });
  });
});
