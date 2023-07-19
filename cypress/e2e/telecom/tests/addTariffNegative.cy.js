const URL = "https://demo.guru99.com/telecom/addtariffplans.php";
const elements = [
  "Monthly Rental",
  "Free Local Minutes",
  "Free International Minutes",
  "Free SMS Pack",
  "Local Per Minutes Charges",
  "International Per Minutes Charges",
  "SMS Per Charges",
];

describe("Add tariff negative", () => {
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

  it("Element Presence check on Add Tariff Page", () => {
    cy.log("Checking label Add Tariff Plans");
    cy.get("header.align-center h1")
      .contains("Add Tariff Plans")
      .should("have.css", "text-align", "center")
      .should("have.css", "color", "rgb(37, 162, 195)");

    cy.log("Checking input Monthly Rental");
    cy.get("input#rental1")
      .should("be.visible")
      .should("have.attr", "maxlength", "5")
      .should("have.attr", "placeholder", "Monthly Rental");

    cy.log("Checking input Free Local Minutes");
    cy.get("input#local_minutes")
      .should("be.visible")
      .should("have.attr", "maxlength", "5")
      .should("have.attr", "placeholder", "Free Local Minutes");

    cy.log("Checking input Free International Minutes");
    cy.get("input#inter_minutes")
      .should("be.visible")
      .should("have.attr", "maxlength", "5")
      .should("have.attr", "placeholder", "Free International Minutes");

    cy.log("Checking input Free SMS Pack");
    cy.get("input#sms_pack")
      .should("be.visible")
      .should("have.attr", "maxlength", "5")
      .should("have.attr", "placeholder", "Free SMS Pack");

    cy.log("Checking input Local Per Minutes Charges");
    cy.get("input#minutes_charges")
      .should("be.visible")
      .should("have.attr", "maxlength", "3")
      .should("have.attr", "placeholder", "Local Per Minutes Charges");

    cy.log("Checking input Inter. Per Minutes Charges");
    cy.get("input#inter_charges")
      .should("be.visible")
      .should("have.attr", "maxlength", "3")
      .should("have.attr", "placeholder", "Inter. Per Minutes Charges");

    cy.log("Checking input SMS Per Charges");
    cy.get("input#sms_charges")
      .should("be.visible")
      .should("have.attr", "maxlength", "3")
      .should("have.attr", "placeholder", "SMS Per Charges");

    cy.log("Checking button Submit");
    cy.get('input[type="submit"]')
      .should("be.visible")
      .should("have.css", "background-color", "rgb(246, 117, 94)")
      .should("have.css", "color", "rgb(255, 255, 255)")
      .should("have.css", "text-align", "center");

    cy.log("Checking button Reset");
    cy.get('input[type="reset"]')
      .should("be.visible")
      .should("be.visible")
      .should("have.css", "background-color", "rgba(0, 0, 0, 0)")
      .should("have.css", "color", "rgb(114, 122, 130)")
      .should("have.css", "text-align", "center");

    cy.checkLogo();

    elements.forEach((text, index) => {
      cy.log(`Checking label ${text}`);
      cy.get("div.3u.12u\\$\\(small\\) h3")
        .eq(index)
        .should("have.css", "text-align", "center")
        .should("have.text", text)
        .should("have.css", "color", "rgb(37, 162, 195)");
    });
  });

  it("Check special characters", () => {
    const fieldValues = Array(7).fill(999);
    const specialCharacters = [
      "!",
      "@",
      "#",
      "$",
      "%",
      "^",
      "&",
      "*",
      "(",
      ")",
      ":",
      ".",
    ];

    specialCharacters.forEach((character) => {
      const invalidValue = `11${character}`;
      cy.checkInvalidValue(
        fieldValues,
        invalidValue,
        "Special characters are not allowed"
      );
    });
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
