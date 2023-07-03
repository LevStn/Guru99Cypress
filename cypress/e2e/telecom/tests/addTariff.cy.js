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
    cy.checkSuccessMessage("Congratulation you add Tariff Plan");
  });

  it("Minimum valid value", () => {
    const values = [1, 0, 0, 0, 0, 0, 0];
    cy.insertData(values);
    cy.checkFieldValues(values);
    cy.submitClick();
    cy.checkSuccessMessage("Congratulation you add Tariff Plan");
  });

  it("Check special characters", () => {
    const fieldValues = [999, 999, 999, 999, 999, 999, 999];
    const invalidValue = "1?1";

    cy.checkInvalidValue(
      fieldValues,
      invalidValue,
      "Special characters are not allowed"
    );
  });

  it("Check chars", () => {
    const fieldValues = [999, 999, 999, 999, 999, 999, 999];
    const invalidValue = "1a1";

    cy.checkInvalidValue(
      fieldValues,
      invalidValue,
      "Characters are not allowed"
    );
  });

  it("Check empty field", () => {
    const fieldValues = [999, 999, 999, 999, 999, 999, 999];

    cy.insertData(fieldValues);
    fieldValues.forEach((value, index) => {
      cy.removeDataAtIndex(index);

      if (index !== 0 && index < fieldValues.length) {
        cy.removeDataAtIndex(index - 1);
        cy.insertDataAtIndex(index - 1, 999);
        cy.removeDataAtIndex(index);

        cy.checkErrorMessages("Number must not be blank", index);
        cy.submitClick().then((stub) => {
          cy.popUpErrorCheck(stub);
        });
      }
    });
  });

  it("Check negative value", () => {
    const fieldValues = [999, 999, 999, 999, 999, 999, 999];
    const invalidValue = -1;

    cy.checkInvalidValue(
      fieldValues,
      invalidValue,
      "Negative values are not allowed"
    );
  });
});
