Cypress.Commands.add("fillForm", (data) => {
  const fields = ["fname", "lname", "email", "message", "telephoneno"];

  fields.forEach((field) => {
    const value = data[field];
    cy.log(`Value entered ${field}:${data[field]}`);

    if (value !== "") {
      if (field === "message") {
        cy.get("textarea#message").clear().type(value);
      } else {
        cy.get(`#${field}`).clear().type(value);
      }
    }
  });
});

Cypress.Commands.add("clearForm", () => {
  cy.log("Clear form");
  cy.get("#fname").clear();
  cy.get("#lname").clear();
  cy.get("#email").clear();
  cy.get("textarea#message").clear();
  cy.get("#telephoneno").clear();
});

Cypress.Commands.add("getCustomerId", () => {
  cy.log("Get customer id");
  return cy
    .get("table.alt.access h3")
    .should("be.visible")
    .should("have.css", "color", "rgb(37, 162, 195)")
    .invoke("text")
    .then((text) => {
      return text.trim();
    });
});

Cypress.Commands.add("checkFormData", (data) => {
  cy.log("Check data in form");
  const { fname, lname, email, message, telephoneno } = data;
  cy.get("#fname").should("have.value", fname);
  cy.get("#lname").should("have.value", lname);
  cy.get("#email").should("have.value", email);
  cy.get("textarea#message").should("have.value", message);
  cy.get("#telephoneno").should("have.value", telephoneno);
});

Cypress.Commands.add("removeData", (fieldName) => {
  cy.log(`Remove ${fieldName}`);
  cy.get(`#${fieldName}`).clear();
});

Cypress.Commands.add("checkErrorMessageCustomerName", (errorMessage) => {
  cy.log(`Check error message in customer name:${errorMessage}`);
  cy.get("#message").then(($message) => {
    if ($message.length > 0 && $message.css("visibility") !== "hidden") {
      const text = $message.text().trim();
      expect(text).to.eq(errorMessage);
    }
  });
  cy.get("#message50").then(($message50) => {
    if ($message50.length > 0 && $message50.css("visibility") !== "hidden") {
      const text = $message50.text().trim();
      expect(text).to.eq(errorMessage);
    }
  });
  cy.get("#message7").then(($message7) => {
    if ($message7.length > 0 && $message7.css("visibility") !== "hidden") {
      const text = $message7.text().trim();
      expect(text).to.eq(errorMessage);
    }
  });
});

Cypress.Commands.add(
  "checkInvalidData",
  (validCustomer, invalidData, errorMessage, invalidFields) => {
    invalidFields.forEach((field) => {
      const invalidFormData = Cypress._.merge({}, validCustomer, {
        [field]: invalidData,
      });
      cy.fillForm(invalidFormData);
      cy.checkErrorMessageCustomerName(errorMessage);
      cy.get('input[type="submit"]').click();
      cy.url().should("eq", "https://demo.guru99.com/telecom/addcustomer.php");
      cy.clearForm();
    });
  }
);

Cypress.Commands.add("checkLogo", () => {
  cy.log("Check logo");
  cy.get("a.logo")
    .should("be.visible")
    .should("have.css", "background-color", "rgba(0, 0, 0, 0)")
    .should("have.css", "color", "rgb(246, 117, 94)")
    .should("have.css", "margin-top", "-5px")
    .should("have.css", "padding-left", "600px")
    .should("have.css", "font-size", "37px")
    .should("have.css", "font-family", "Pacifico, cursive")
    .should("have.css", "font-weight", "300");
});

Cypress.Commands.add("getJson", (filename) => {
  return cy.readFile(`cypress/fixtures/${filename}`);
});
