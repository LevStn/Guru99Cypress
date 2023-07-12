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

    cy.get("span#header").should("be.visible").should("contain", "Menu");

    cy.get(".left").find('a[href="#menu"]').click();

    pages.forEach((page) => {
      cy.visit(`${URL}`).then(() => {
        cy.get("nav#menu").contains(page.label).click({ force: true });
        cy.url().should("eq", page.url);

        cy.get("nav#menu")
          .contains(page.label)
          .should("have.text", page.label)
          .should("have.css", "color", "rgb(255, 255, 255)");
      });
    });
  });

  it("Check homepage links", () => {
    const links = [
      {
        selector: ".flex-item.left",
        link: "addcustomer.php",
        heading: "Add Customer",
        content:
          "Morbi in sem quis dui plalorem ipsum euismod in, pharetra sed ultricies.",
      },
      {
        selector: ".flex-item.left",
        link: "assigntariffplantocustomer.php",
        heading: "Add Tariff Plan to Customer",
        content:
          "Tristique yonve cursus jam nulla quam loreipsu gravida adipiscing lorem",
      },
      {
        selector: ".flex-item.right",
        link: "addtariffplans.php",
        heading: "Add Tariff Plan",
        content:
          "Sed adipiscing ornare risus. Morbi estes blandit sit et amet, sagittis magna.",
      },
      {
        selector: ".flex-item.right",
        link: "billing.php",
        heading: "Pay Billing",
        content:
          "Pellentesque egestas sem. Suspendisse modo ullamcorper feugiat lorem.",
      },
    ];

    cy.get(".flex-item.image").find("img").should("exist");

    links.forEach((link) => {
      cy.get(link.selector)
        .find(`a[href="${link.link}"]`)
        .should("have.text", link.heading)
        .should("have.css", "color", "rgb(37, 162, 195)")
        .click();
      cy.url().should(`eq`, `https://demo.guru99.com/telecom/${link.link}`);
      cy.go("back");

      cy.get(link.selector)
        .find('p[style="font-weight:300;font-size:15px;line-height:20px;"]')
        .should("contain", link.content)
        .should("have.css", "color", "rgb(118, 125, 133)");
    });
  });
});
