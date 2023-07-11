Cypress.Commands.add("insertData", (values) => {
  cy.get(".uniform > .3u > input").each(($el, index) => {
    const val = values[index % values.length];
    cy.wrap($el).scrollIntoView().type(val);
  });
});

Cypress.Commands.add("insertDataAtIndex", (index, value) => {
  cy.get(".uniform > .3u > input")
    .eq(index)
    .scrollIntoView()
    .then(($el) => {
      if (value !== undefined && value !== "") {
        cy.wrap($el).clear().type(value.toString());
      } else {
        cy.wrap($el).clear();
      }
    });
});

Cypress.Commands.add("removeDataAtIndex", (index, value) => {
  cy.get(".uniform > .3u > input").eq(index).scrollIntoView().clear();
});

Cypress.Commands.add("checkFieldValues", (values) => {
  cy.get(".uniform > .3u > input").each(($el, index) => {
    const expectedValue = values[index % values.length].toString();
    cy.wrap($el).should("have.value", expectedValue);
  });
});

Cypress.Commands.add("checkSuccessMessage", (message) => {
  cy.get("h2")
    .should("have.text", message)
    .should("have.css", "color", "rgb(37, 162, 195)")
    .should("have.css", "text-align", "center");
});

Cypress.Commands.add("checkErrorMessages", (expectedError, index) => {
  cy.get(".6u.12u\\$\\(small\\) label")
    .eq(index)
    .should("have.text", expectedError)
    .should("have.css", "visibility", "visible");
});

Cypress.Commands.add("сlearData", () => {
  cy.get(".uniform > .3u > input").each(($el) => {
    cy.wrap($el).clear();
  });
});

Cypress.Commands.add("popUpErrorCheck", (stub) => {
  const firstCall = stub.getCall(0);
  const expectedArgument = "please fill all fields Correct Value";

  expect(firstCall).to.be.calledWith(expectedArgument);
});

Cypress.Commands.add("submitClick", () => {
  const stub = cy.stub();

  cy.on("window:alert", stub);

  cy.get('input[value="submit"]').scrollIntoView().click();

  return cy.wrap(stub);
});

Cypress.Commands.add(
  "checkInvalidValue",
  (fieldValues, invalidValue, errorMessage) => {
    const values = [...fieldValues];
    cy.insertData(fieldValues);

    fieldValues.forEach((correctValue, index) => {
      cy.removeDataAtIndex(index);

      if (index != 0 && index < values.length) {
        cy.removeDataAtIndex(index - 1);
        cy.insertDataAtIndex(index - 1, values[0]);
        cy.insertDataAtIndex(index, invalidValue);

        cy.checkErrorMessages(errorMessage, index);
        cy.submitClick().then((stub) => {
          cy.popUpErrorCheck(stub);
        });
      }
    });
  }
);

Cypress.Commands.add("clickButtonAndVerify", (text) => {
  cy.get("a.button")
    .should("be.visible")
    .should("have.css", "background-color", "rgb(246, 117, 94)")
    .should("have.css", "color", "rgb(255, 255, 255)")
    .should("have.css", "text-align", "center")
    .contains(text)
    .click();
});
