describe("Payment geteway", () => {
  it("Pay", () => {
    cy.fixture("cookies.json").then((cookies) => {
      cookies.forEach((cookie) => {
        cy.setCookie(cookie.name, cookie.value);
      });
    });
    cy.log("open page");
    cy.visit("https://demo.guru99.com/payment-gateway/index.php");

    cy.wait(5000);

    cy.get('li.dropdown a[href="http://demo.guru99.com/insurance/v1/index.php"]').click();                   
  });
});
