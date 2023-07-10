const URL = "https://demo.guru99.com/telecom/addtariffplans.php";

describe("Add tariff", () => {
  beforeEach(() => {
    cy.fixture("cookies.json").then((cookies) => {
      cookies.forEach((cookie) => {
        cy.setCookie(cookie.name, cookie.value);
      });
    });
    cy.log("open page");
    cy.visit("https://demo.guru99.com/telecom/addtariffplans.php");
  });

  it("Element Presence check on Add Tariff Page", () => {
    cy.get("input#rental1")
      .should("be.visible")
      .and("have.attr", "maxlength", "5");

    cy.get("input#local_minutes")
      .should("be.visible")
      .and("have.attr", "maxlength", "5");

    cy.get("input#inter_minutes")
      .should("be.visible")
      .and("have.attr", "maxlength", "5");

    cy.get("input#sms_pack")
      .should("be.visible")
      .and("have.attr", "maxlength", "5");

    cy.get("input#minutes_charges")
      .should("be.visible")
      .and("have.attr", "maxlength", "3");

    cy.get("input#inter_charges")
      .should("be.visible")
      .and("have.attr", "maxlength", "3");

    cy.get("input#sms_charges")
      .should("be.visible")
      .and("have.attr", "maxlength", "3");

    cy.get('input[type="submit"]').should("be.visible");

    cy.get('input[type="reset"]').should("be.visible");
  });

  it("Maximum valid value", () => {
    const values = [99999, 99999, 9999, 9999, 999, 999, 999];
    cy.insertData(values);
    cy.checkFieldValues(values);
    cy.submitClick();
    cy.url().should("eq", URL);
    cy.checkSuccessMessage("Congratulation you add Tariff Plan");
  });

  it("Minimum valid value", () => {
    const values = [1, 0, 0, 0, 0, 0, 0];
    cy.insertData(values);
    cy.checkFieldValues(values);
    cy.submitClick();
    cy.url().should("eq", URL);
    cy.checkSuccessMessage("Congratulation you add Tariff Plan");
  });

  it("Check special characters", () => {
    const fieldValues = Array(7).fill(999);
    const invalidValue = "1?1";

    cy.checkInvalidValue(
      fieldValues,
      invalidValue,
      "Special characters are not allowed"
    );
  });

  it("Check chars", () => {
    const fieldValues = Array(7).fill(999);
    const invalidValue = "1a1";

    cy.checkInvalidValue(
      fieldValues,
      invalidValue,
      "Characters are not allowed"
    );
  });

  it("Check empty field", () => {
    const fieldValues = Array(7).fill(999);
    const invalidValue = "";

    cy.checkInvalidValue(fieldValues, invalidValue, "Number must not be blank");
  });

  it("Checking the maximum length for fields", () => {
    const fieldValues = [100000, 100000, 100000, 100000, 1000, 1000, 1000];
    const actualValue = [10000, 10000, 10000, 10000, 100, 100, 100];

    cy.insertData(fieldValues);
    cy.checkFieldValues(actualValue);
  });

  it("Check negative value", () => {
    const fieldValues = Array(7).fill(999);
    const invalidValue = -1;

    cy.checkInvalidValue(
      fieldValues,
      invalidValue,
      "Negative values are not allowed"
    );
  });

  it("Сhecking the minimum value for monthly rent", () => {
    const values = [0, 0, 0, 0, 0, 0, 0];
    cy.insertData(values);
    cy.checkFieldValues(values);
    cy.submitClick().then((stub) => {
      cy.popUpErrorCheck(stub);
    });
  });

  it("Checking button reset", () => {
    const fieldValues = Array(7).fill(999);
    const expectedValues = Array(7).fill("");

    cy.insertData(fieldValues);
    cy.checkFieldValues(fieldValues);
    cy.get('input[type="reset"].alt').click();
    cy.checkFieldValues(expectedValues);
    cy.submitClick().then((stub) => {
      cy.popUpErrorCheck(stub);
    });
  });
});