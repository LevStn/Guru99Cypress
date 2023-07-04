const SUCCESS_URL = "https://demo.guru99.com/telecom/access.php?uid=";
const BASE_URL = "https://demo.guru99.com/telecom/addcustomer.php";

const validCustomer = {
  fname: "John",
  lname: "Doe",
  email: "test@test.com",
  message: "This is my address",
  telephoneno: "1234567890",
};

describe("Add customer", () => {
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
    cy.get("input#done").should("exist");
    cy.get("input#pending").should("exist");
    cy.get("input#fname").should("be.visible");
    cy.get("input#lname").should("be.visible");
    cy.get("input#email").should("be.visible");
    cy.get("textarea#message").should("be.visible");
    cy.get("input#telephoneno").should("be.visible");
    cy.get('input[type="submit"]').should("be.visible");
    cy.get('input[type="reset"]').should("be.visible");
  });

  it("Enter valid data whith the radiobutton done", () => {
    cy.get("#done").check({ force: true });
    cy.fillForm(validCustomer);
    cy.checkFormData(validCustomer);
    cy.get('input[type="submit"]').click();

    cy.getCustomerIdFromTable().then((customerId) => {
      cy.url().should("eq", `${SUCCESS_URL}${customerId}`);
    });
  });

  it("Enter valid data whith the radiobutton pending", () => {
    cy.get("#pending").check({ force: true });
    cy.fillForm(validCustomer);
    cy.checkFormData(validCustomer);
    cy.get('input[type="submit"]').click();

    cy.getCustomerIdFromTable().then((customerId) => {
      cy.url().should("eq", `${SUCCESS_URL}${customerId}`);
    });
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
