const SUCCESS_URL = "https://demo.guru99.com/telecom/access.php?uid=";
const BASE_URL = "https://demo.guru99.com/telecom/addcustomer.php";

describe("Add customer", () => {
  let validCustomer;
  before(() => {
    cy.readFile("cypress/fixtures/customer.json").then((json) => {
      validCustomer = json;
    });
  });

  beforeEach(() => {
    cy.fixture("cookies.json").then((cookies) => {
      cookies.forEach((cookie) => {
        cy.setCookie(cookie.name, cookie.value);
      });
    });
    cy.log("open page");
    cy.visit(BASE_URL);
  });

  it("Element Presence check on Add Customer", () => {
    cy.get("header.align-center h1")
      .should("have.text", "Add Customer")
      .should("have.css", "color", "rgb(37, 162, 195)")
      .should("have.css", "font-weight", "700")
      .should("have.css", "font-family", "Montserrat, sans-serif")
      .should("have.css", "font-size", "29px")
      .should("have.css", "line-height", "38px");

    cy.get("form")
      .contains("h3", "Background Check")
      .should("be.visible")
      .should("have.css", "color", "rgb(37, 162, 195)")
      .should("have.css", "font-weight", "700")
      .should("have.css", "font-family", "Montserrat, sans-serif")
      .should("have.css", "font-size", "18px");

    cy.get('label[for="done"]')
      .should("have.text", "Done")
      .should("exist")
      .should("have.css", "color", "rgb(118, 125, 133)");
    cy.get("input#done").should("exist");

    cy.get('label[for="pending"]')
      .should("have.text", "Pending")
      .should("exist")
      .should("have.css", "color", "rgb(118, 125, 133)");
    cy.get("input#pending").should("exist");

    cy.get("div.12u\\$ h3")
      .should("have.text", "Billing address")
      .should("exist")
      .should("have.css", "color", "rgb(37, 162, 195)")
      .should("have.css", "font-weight", "700")
      .should("have.css", "font-family", "Montserrat, sans-serif")
      .should("have.css", "font-size", "18px");

    cy.get("input#fname")
      .should("be.visible")
      .should("have.attr", "placeholder", "FirstName");
    cy.get("input#lname")
      .should("be.visible")
      .should("have.attr", "placeholder", "LastName");
    cy.get("input#email")
      .should("be.visible")
      .should("have.attr", "placeholder", "Email");
    cy.get("textarea#message")
      .should("be.visible")
      .should("have.attr", "placeholder", "Enter your address");
    cy.get("input#telephoneno")
      .should("be.visible")
      .should("have.attr", "maxlength", "12")
      .should("have.attr", "placeholder", "Mobile Number");

    cy.get('input[type="submit"]')
      .should("be.visible")
      .should("have.css", "background-color", "rgb(246, 117, 94)")
      .should("have.css", "color", "rgb(255, 255, 255)")
      .should("have.css", "text-align", "center");

    cy.get('input[type="reset"]')
      .should("be.visible")
      .should("have.css", "background-color", "rgba(0, 0, 0, 0)")
      .should("have.css", "color", "rgb(114, 122, 130)")
      .should("have.css", "text-align", "center");

    cy.checkLogo();
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

  it("Сhecking the transition to the home page when clicking on the logo", () => {
    cy.get("a.logo").contains("Guru99 telecom").click();
    cy.url().should("eq", "https://demo.guru99.com/telecom/index.html");
  });

  it("Check invalid customer name", () => {
    const ErrorMessages = [
      "Special characters are not allowed",
      "Numbers are not allowed",
      "Customer name must not be blank",
    ];

    const invalidData = ["&", "111", ""];
    const invalidFields = ["fname", "lname"];

    cy.get("#done").check({ force: true });

    invalidData.forEach((invalidData, index) => {
      cy.checkInvalidData(
        validCustomer,
        invalidData,
        ErrorMessages[index],
        invalidFields
      );
    });
  });

  it("Check invalid phone number", () => {
    const ErrorMessages = [
      "Characters are not allowed",
      "Special characters are not allowed",
      "Mobile no must not be blank",
    ];

    const invalidData = ["AAA", "&&&", ""];
    const invalidFields = ["telephoneno"];

    cy.get("#done").check({ force: true });

    invalidData.forEach((invalidData, index) => {
      cy.checkInvalidData(
        validCustomer,
        invalidData,
        ErrorMessages[index],
        invalidFields
      );
    });
  });

  it("Сheck for invalid emails", () => {
    cy.fillForm(validCustomer);
    const emails = ["asa@gmailru", "assagmail.ru"];

    emails.forEach((email) => {
      cy.get("#email").clear().type(email);
      cy.get("#message9")
        .invoke("text")
        .then((text) => {
          expect(text.trim()).to.equal("Email-ID is not valid");
        });
      cy.get('input[type="submit"]').click();
      cy.get("#email").clear();
    });
  });

  it("Length limit check", () => {
    const data = {
      fname: "A".repeat(25),
      lname: "A".repeat(25),
      email: "A".repeat(25),
      message: "A".repeat(40),
      telephoneno: "1".repeat(13),
    };

    const expectedData = {
      fname: "A".repeat(24),
      lname: "A".repeat(24),
      email: "A".repeat(24),
      message: "A".repeat(39),
      telephoneno: "1".repeat(12),
    };
    cy.fillForm(data);
    cy.checkFormData(expectedData);
  });

  it("Check reset button", () => {
    const expectedData = {
      fname: "",
      lname: "",
      email: "",
      message: "",
      telephoneno: "",
    };

    cy.get("#pending").check({ force: true });
    cy.fillForm(validCustomer);
    cy.checkFormData(validCustomer);
    cy.get('input[type="reset"]').click();
    cy.checkFormData(expectedData);

    cy.get('input[type="submit"]').click();
    cy.url().should("eq", BASE_URL);
  });
});
