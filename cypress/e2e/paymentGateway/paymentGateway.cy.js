const SUCCESS_URL =
  "https://demo.guru99.com/payment-gateway/genearte_orderid.php?uid=";
const PAYMENT_URL =
  "https://demo.guru99.com/payment-gateway/process_purchasetoy.php";

const validCards = {
  Visa: {
    number: "4241257934945517",
    month: "11",
    year: "2025",
    cvv: "857",
    balance: "50",
  },
  "Master Card": {
    number: "5555555555554444",
    month: "12",
    year: "2023",
    cvv: "874",
    balance: "50",
  },
  Discover: {
    number: "6011111111111117",
    month: "4",
    year: "2026",
    cvv: "231",
    balance: "50",
  },
  "American Express": {
    number: "3782822463100055",
    month: "3",
    year: "2026",
    cvv: "995",
    balance: "50",
  },
};

describe("Payment geteway", () => {
  let amount;

  beforeEach(() => {
    cy.fixture("cookies.json").then((cookies) => {
      cookies.forEach((cookie) => {
        cy.setCookie(cookie.name, cookie.value);
      });
    });
    cy.log("open page");
    cy.visit("https://demo.guru99.com/payment-gateway/index.php");

    cy.get("h3").then(($h3) => {
      const text = $h3.text();
      const price = parseFloat(text.replace("Price: $", ""));

      cy.get('select[name="quantity"]').then(($select) => {
        const val = $select.val();
        const quantity = parseInt(val);

        amount =(price * quantity).toFixed(2);
      });
    });
    cy.get('input[type="submit"]').click();
  });

  it("Element Presence check on pay page", () => {
    cy.get(".align-center h2")
      .should("have.text", "Payment Process")
      .should("have.css", "text-align", "center")
      .should("have.css", "color", "rgb(85, 85, 85)");

    cy.get(".row")
      .contains("Pay Ammount")
      .should("have.css", "color", "rgb(154, 154, 154)");

    console.log("aa1", `${amount}`);
    cy.get("font")
      .contains(`$${amount}`)
      .should("have.css", "color", "rgb(255, 0, 0)");

    cy.get(".row.uniform h4")
      .contains("We accept")
      .should("have.css", "text-align", "center")
      .should("have.css", "color", "rgb(85, 85, 85)");

    cy.get('[class="6u$ 12u$(xsmall)"] img').should("be.visible");

    cy.get('[class="3u 12u$(xsmall)"] h4')
      .contains("Card Number")
      .should("have.css", "color", "rgb(85, 85, 85)");
    cy.get("#card_nmuber")
      .should("be.visible")
      .and("have.attr", "maxlength", "16")
      .should("have.attr", "placeholder", "Enter Your Card Number");

    cy.get('[class="3u 12u$(xsmall)"] h4')
      .contains("Expiration Month")
      .should("have.css", "color", "rgb(85, 85, 85)");
    cy.get("#month").should("be.visible");

    cy.get('[class="3u 12u$(xsmall)"] h4')
      .contains("Expiration Year")
      .should("have.css", "color", "rgb(85, 85, 85)");
    cy.get("#year").should("be.visible");

    cy.get('[class="3u 12u$(xsmall)"] h4')
      .contains("CVV Code")
      .should("have.css", "color", "rgb(85, 85, 85)");
    cy.get("#cvv_code")
      .should("be.visible")
      .and("have.attr", "maxlength", "3")
      .should("have.attr", "placeholder", "CVV Code");

    cy.get('input[type="submit"]')
      .should("be.visible")
      .should("have.css", "background-color", "rgb(108, 192, 145)")
      .should("have.css", "color", "rgb(255, 255, 255)")
      .should("have.value", `Pay $${amount}`);
  });

  it("Сorrect payment from valid banks", () => {
    Object.keys(validCards).forEach((bank, index) => {
      const card = validCards[bank];

      cy.fillPaymentDetails(card);
      cy.verifyCardDetails(card);
      cy.get(".button.special").click();
      cy.wait(2000);
      cy.get("h3 strong")
        .invoke("text")
        .then((text) => {
          const orderId = text.match(/\d+/g).join("");
          const expectedUrl = `${SUCCESS_URL}${orderId}`;
          cy.url().should("eq", expectedUrl);
        });

      if (index !== Object.keys(validCards).length - 1) {
        cy.visit("https://demo.guru99.com/payment-gateway/index.php");
        cy.get("input.button.special").click();
      }
    });
    cy.get(".table-wrapper h2")
      .contains("Payment successfull!")
      .should("have.css", "color", "rgb(85, 85, 85)");
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
    cy.get(".button.special").click();
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
      cy.get(".button.special").click();
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
    cy.get(".button.special").click();
    cy.url().should("eq", PAYMENT_URL);
  });

  it("Incorrect cvv", () => {
    const invalidCvv = {
      ...validCards["Visa"],
      cvv: "000",
    };
    cy.fillPaymentDetails(invalidCvv);
    cy.verifyCardDetails(invalidCvv);
    cy.get(".button.special").click();
    cy.url().should("eq", PAYMENT_URL);
  });

  it("Сheck payment with zero balance", () => {
    const EmptyBalance = {
      number: "6011111111291117",
      month: "4",
      year: "2026",
      cvv: "233",
      balance: "0",
    };

    cy.fillPaymentDetails(EmptyBalance);
    cy.verifyCardDetails(EmptyBalance);
    cy.get(".button.special").click();
    cy.contains("Not enough money!");
  });

  it("Checking the card number field for validation", () => {
    const testCases = [
      {
        invalidCard: { ...validCards["Visa"], number: "" },
        errorMessage: "Field must not be blank",
      },
      {
        invalidCard: { ...validCards["Visa"], number: "&".repeat(16) },
        errorMessage: "Special characters are not allowed",
      },
      {
        invalidCard: { ...validCards["Visa"], number: "A".repeat(16) },
        errorMessage: "Characters are not allowed",
      },
    ];

    testCases.forEach(({ invalidCard, errorMessage }) => {
      cy.fillPaymentDetails(invalidCard);
      cy.verifyCardDetails(invalidCard);
      cy.checkCardError("#message1", errorMessage);
      cy.get(".button.special").click();
      cy.url().should("eq", PAYMENT_URL);
    });
  });

  it("Checking the cvv field for validation", () => {
    const testCases = [
      {
        invalidCard: { ...validCards["Visa"], cvv: "&".repeat(3) },
        errorMessage: "Special characters are not allowed",
      },
      {
        invalidCard: { ...validCards["Visa"], cvv: "A".repeat(3) },
        errorMessage: "Characters are not allowed",
      },
    ];

    testCases.forEach(({ invalidCard, errorMessage }) => {
      cy.fillPaymentDetails(invalidCard);
      cy.verifyCardDetails(invalidCard);
      cy.checkCardError("#message2", errorMessage);
      cy.get(".button.special").click();
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
