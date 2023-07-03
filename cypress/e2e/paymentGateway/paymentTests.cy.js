describe("Payment geteway", () => {
  it("Pay", () => {
    cy.log("open page");
    cy.visit("https://demo.guru99.com/payment-gateway/index.php");

    cy.get('input[type="submit"][value="Buy Now"].button.special').click();

    cy.get('input[type="text"][name="card_number"][id="card_number"]')
      .should("have.attr", "maxlength", "16")
      .should("have.attr", "placeholder", "Enter Your Card Number")
      .should("have.css", "font-size", "1.2em");

    cy.get('input[name="card_number"]')
      .type("1234567890123456")
      .trigger("blur");
  });
});
