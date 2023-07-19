Cypress.Commands.add("insertData", (values) => {
  cy.get(".uniform > .3u > input").each(($el, index) => {
    const val = values[index % values.length];
    cy.log(`Insert ${val} at index:${index}`);

    cy.wrap($el)
      .scrollIntoView()
      .then(($input) => {
        if ($input.val().trim() !== "") {
          cy.wrap($input).clear();
        }
        cy.wrap($input).type(val);
      });
  });
});

Cypress.Commands.add("insertDataAtIndex", (index, value) => {
  cy.log(`Insert ${value} at index:${index}`);
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

Cypress.Commands.add("removeDataAtIndex", (index) => {
  cy.log(`Remove data at index:${index}`);
  cy.get(".uniform > .3u > input").eq(index).scrollIntoView().clear();
});

Cypress.Commands.add("checkFieldValues", (values) => {
  cy.log("Check field");
  cy.get(".uniform > .3u > input").each(($el, index) => {
    const expectedValue = values[index % values.length].toString();
    cy.wrap($el).should("have.value", expectedValue);
  });
});

Cypress.Commands.add("checkSuccessMessage", (message) => {
  cy.log(`Check mesage:${message}`);
  cy.get("h2")
    .should("have.text", message)
    .should("have.css", "color", "rgb(37, 162, 195)")
    .should("have.css", "text-align", "center");
});

Cypress.Commands.add("checkErrorMessages", (expectedError, index) => {
  cy.log(`Check error:${expectedError}`);
  cy.get(".6u.12u\\$\\(small\\) label")
    .eq(index)
    .should("have.text", expectedError)
    .should("have.css", "visibility", "visible");
});

Cypress.Commands.add("сlearData", () => {
  cy.log("Clear data");
  cy.get(".uniform > .3u > input").each(($el) => {
    cy.wrap($el).clear();
  });
});

Cypress.Commands.add("popUpErrorCheck", (stub) => {
  cy.log("Pop up error check");
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
  cy.log(`Click on the button ${text}`);
  cy.get("a.button")
    .contains(text)
    .should("be.visible")
    .should("have.css", "background-color", "rgb(246, 117, 94)")
    .should("have.css", "color", "rgb(255, 255, 255)")
    .should("have.css", "text-align", "center")
    .click();
});
