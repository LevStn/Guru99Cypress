const URL = "https://demo.guru99.com/telecom/index.html";

describe("Home page", () => {
  beforeEach(() => {
    cy.fixture("cookies.json").then((cookies) => {
      cookies.forEach((cookie) => {
        cy.setCookie(cookie.name, cookie.value);
      });
    });
    cy.log("open page");
    cy.visit(`${URL}`);
  });

  it("Check sidebar on home page", () => {
    const pages = [
      { label: "Home", url: `${URL}` },
      {
        label: "Add Customer",
        url: "https://demo.guru99.com/telecom/addcustomer.php",
      },
      {
        label: "Add Tariff Plans",
        url: "https://demo.guru99.com/telecom/addtariffplans.php",
      },
      {
        label: "Add Tariff Plan to Customer",
        url: "https://demo.guru99.com/telecom/assigntariffplantocustomer.php",
      },
      {
        label: "Pay Billing",
        url: "https://demo.guru99.com/telecom/billing.php",
      },
    ];

    cy.get("span#header").should("be.visible");
    cy.get("span#header").should("contain", "Menu");

    cy.get(".left").find('a[href="#menu"]').click();

    pages.forEach((page) => {
      cy.visit(`${URL}`).then(() => {
        cy.get("nav#menu").contains(page.label).click({ force: true });
        cy.url().should("eq", page.url);
      });
    });
  });

  it("Сheck homepage links", () => {
    cy.get(".flex-item.left").find('a[href="addcustomer.php"]').click();
    cy.url().should("eq", "https://demo.guru99.com/telecom/addcustomer.php");
    cy.go("back");

    cy.get(".flex-item.left")
      .find('a[href="assigntariffplantocustomer.php"]')
      .click();
    cy.url().should(
      "eq",
      "https://demo.guru99.com/telecom/assigntariffplantocustomer.php"
    );
    cy.go("back");

    cy.get(".flex-item.right").find('a[href="addtariffplans.php"]').click();
    cy.url().should("eq", "https://demo.guru99.com/telecom/addtariffplans.php");
    cy.go("back");

    cy.get(".flex-item.right").find('a[href="billing.php"]').click();
    cy.url().should("eq", "https://demo.guru99.com/telecom/billing.php");
  });
});
