/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    getByData(dataTestAttribute: string): Chainable<JQuery<HTMLElement>>;
    randomize(amountElemets: number): number;
  }
}

Cypress.Commands.add("getByData", (selector) => {
  return cy.get(`[data-cy=${selector}]`);
});

Cypress.Commands.add("randomize", (limit) => {
  const randomNumber = Math.floor(Math.random() * limit);
  return randomNumber;
});
