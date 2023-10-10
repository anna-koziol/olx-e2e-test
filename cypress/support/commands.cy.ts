/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    getByData(selector: string): Chainable<JQuery<HTMLElement>>;
    getAndCheckVisible(
      selector: string,
      isHTMLSelector: boolean
    ): Chainable<JQuery<HTMLElement>>;
  }
}

Cypress.Commands.add("getByData", (selector) => {
  return cy.get(`[data-cy=${selector}]`);
});

Cypress.Commands.add("getAndCheckVisible", (selector, isHTMLSelector) => {
  return isHTMLSelector
    ? cy.get(`${selector}`).should("be.visible")
    : cy.getByData(`${selector}`).should("be.visible");
});
