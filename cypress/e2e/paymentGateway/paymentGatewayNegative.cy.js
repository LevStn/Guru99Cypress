const SUCCESS_URL =
  "https://demo.guru99.com/payment-gateway/genearte_orderid.php?uid=";
const PAYMENT_URL =
  "https://demo.guru99.com/payment-gateway/process_purchasetoy.php";

describe("Payment geteway negative", () => {
  let price;
  let validCards;

  before(() => {
    cy.log("Getting valid cards");
    cy.readFile("cypress/fixtures/validCards.json").then((json) => {
      validCards = json;
    });
  });

  beforeEach(() => {
    cy.setCustomCookies("cookies.json");
    cy.log("Open page select quantity");
    cy.visit("https://demo.guru99.com/payment-gateway/index.php");

    cy.log("Getting a price to write off");
    cy.get("h3").then(($h3) => {
      const text = $h3.text();
      const cost = parseFloat(text.replace("Price: $", ""));

      cy.get('select[name="quantity"]').then(($select) => {
        const val = $select.val();
        const quantity = parseInt(val);

        price = (cost * quantity).toFixed(2);
      });
    });
    cy.get('input[type="submit"]').click();
  });

  it("Element Presence check on pay page", () => {
    cy.log("Checking label Payment Process");
    cy.get(".align-center h2")
      .contains("Payment Process")
      .should("have.css", "text-align", "center")
      .should("have.css", "color", "rgb(85, 85, 85)");

    cy.log("Checking label Payment Ammount");
    cy.get(".row")
      .contains("Pay Ammount")
      .should("have.css", "color", "rgb(154, 154, 154)");

    cy.log(`Checking label Price(${price})`);
    cy.get("font")
      .contains(`$${price}`)
      .should("have.css", "color", "rgb(255, 0, 0)");

    cy.log("Checking label We accept");
    cy.get(".row.uniform h4")
      .contains("We accept")
      .should("have.css", "text-align", "center")
      .should("have.css", "color", "rgb(85, 85, 85)");

    cy.log("Checking img cards");
    cy.get('[class="6u$ 12u$(xsmall)"] img').should("be.visible");

    cy.log("Checking label Card Number");
    cy.get('[class="3u 12u$(xsmall)"] h4')
      .contains("Card Number")
      .should("have.css", "color", "rgb(85, 85, 85)");
    cy.log("Checking field Card Number");
    cy.get("#card_nmuber")
      .should("be.visible")
      .and("have.attr", "maxlength", "16")
      .should("have.attr", "placeholder", "Enter Your Card Number");

    cy.log("Checking Expiration Month");
    cy.get('[class="3u 12u$(xsmall)"] h4')
      .contains("Expiration Month")
      .should("have.css", "color", "rgb(85, 85, 85)");
    cy.get("#month").should("be.visible");

    cy.log("Checking Expiration Year");
    cy.get('[class="3u 12u$(xsmall)"] h4')
      .contains("Expiration Year")
      .should("have.css", "color", "rgb(85, 85, 85)");
    cy.get("#year").should("be.visible");

    cy.log("Checking label CVV Code");
    cy.get('[class="3u 12u$(xsmall)"] h4')
      .contains("CVV Code")
      .should("have.css", "color", "rgb(85, 85, 85)");
    cy.log("Checking field CVV Code");
    cy.get("#cvv_code")
      .should("be.visible")
      .and("have.attr", "maxlength", "3")
      .should("have.attr", "placeholder", "CVV Code");

    cy.log("Checking button Submit");
    cy.get('input[type="submit"]')
      .should("be.visible")
      .should("have.css", "background-color", "rgb(108, 192, 145)")
      .should("have.css", "color", "rgb(255, 255, 255)")
      .should("have.value", `Pay $${price}`);
  });

  it("Maximum +1 length check", () => {
    const testCard = {
      ...validCards["Visa"],
      number: validCards["Visa"].number + "1",
      cvv: validCards["Visa"].cvv + "1",
    };
    cy.fillPaymentDetails(testCard);
    cy.verifyCardDetails(validCards["Visa"]);
  });

  it("Maximum -1 card number length", () => {
    const invalidNumber = {
      ...validCards["Visa"],
      number: validCards["Visa"].number.slice(0, -1),
    };
    cy.fillPaymentDetails(invalidNumber);
    cy.verifyCardDetails(invalidNumber);
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", PAYMENT_URL);
  });

  it("Checking dropdowns for default values", () => {
    const dropdowns = [
      { selector: "#month", defaultValue: "Month" },
      { selector: "#year", defaultValue: "Year" },
    ];

    dropdowns.forEach(({ selector, defaultValue }) => {
      cy.fillPaymentDetails(validCards["Visa"]);
      cy.verifyCardDetails(validCards["Visa"]);
      cy.get(selector).select(defaultValue);
      cy.get('input[type="submit"]').click();
      cy.url().should("eq", PAYMENT_URL);
    });
  });

  it("Payment verification without cvv", () => {
    const emptyCvv = {
      ...validCards["Visa"],
      cvv: "",
    };
    cy.fillPaymentDetails(emptyCvv);
    cy.verifyCardDetails(emptyCvv);
    cy.checkCardError("#message2", "Field must not be blank");
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", PAYMENT_URL);
  });

  it("Incorrect cvv", () => {
    const invalidCvv = {
      ...validCards["Visa"],
      cvv: "000",
    };
    cy.fillPaymentDetails(invalidCvv);
    cy.verifyCardDetails(invalidCvv);
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", PAYMENT_URL);
  });

  it("Сheck payment with zero balance", () => {
    const EmptyBalance = {
      number: "6011111111291117",
      month: "4",
      year: "2026",
      cvv: "233",
      balance: "0",
    }; //

    cy.fillPaymentDetails(EmptyBalance);
    cy.verifyCardDetails(EmptyBalance);
    cy.get('input[type="submit"]').click();
    cy.contains("Not enough money!");
  });

  it("Checking the card number field for validation", () => {
    const testCases = [
      {
        invalidCard: { ...validCards["Visa"], number: "" },
        errorMessage: "Field must not be blank",
      },
      {
        invalidCard: { ...validCards["Visa"], number: "A".repeat(16) },
        errorMessage: "Characters are not allowed",
      },
    ];

    const specialCharacters = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";

    for (let i = 0; i < specialCharacters.length; i++) {
      const number = specialCharacters.charAt(i).repeat(16);
      cy.log(`Test cases add case with card number: ${number}`);
      const errorMessage = "Special characters are not allowed";

      testCases.push({
        invalidCard: { ...validCards["Visa"], number },
        errorMessage,
      });
    }
    cy.log(`Test cases updated their length: ${testCases.length}`);

    testCases.forEach(({ invalidCard, errorMessage }) => {
      cy.fillPaymentDetails(invalidCard);
      cy.verifyCardDetails(invalidCard);
      cy.checkCardError("#message1", errorMessage);
      cy.get('input[type="submit"]').click();
      cy.url().should("eq", PAYMENT_URL);
    });
  });

  it("Checking the cvv field for validation", () => {
    const testCases = [
      {
        invalidCard: { ...validCards["Visa"], cvv: "A".repeat(3) },
        errorMessage: "Characters are not allowed",
      },
    ];

    const specialCharacters = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";

    for (let i = 0; i < specialCharacters.length; i++) {
      const cvv = specialCharacters.charAt(i).repeat(3);
      cy.log(`Test cases add case with ${cvv}`);
      const errorMessage = "Special characters are not allowed";

      testCases.push({
        invalidCard: { ...validCards["Visa"], cvv },
        errorMessage,
      });
    }
    cy.log(`Test cases updated their length: ${testCases.length}`);

    testCases.forEach(({ invalidCard, errorMessage }) => {
      cy.fillPaymentDetails(invalidCard);
      cy.verifyCardDetails(invalidCard);
      cy.checkCardError("#message2", errorMessage);
      cy.get('input[type="submit"]').click();
      cy.url().should("eq", PAYMENT_URL);
    });
  });

  it("Checking the dropdown for minimum year as the current year", () => {
    const currentYear = new Date().getFullYear();

    cy.get("#year").then((select) => {
      const options = Array.from(select[0].options);
      const minYear = parseInt(options[1].value);

      expect(minYear).to.eq(currentYear);
    });
  });
});
