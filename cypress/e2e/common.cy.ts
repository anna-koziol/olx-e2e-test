/// <reference types="cypress" />

export const openOlx = () => {
  //// GIVEN mainpage is opened
  cy.visit("https://www.olx.pl/");

  //// WHEN banner with consent to use data appears
  cy.get("body").then(($body) => {
    if ($body.find("#onetrust-banner-sdk").length > 0) {
      //// THEN close it
      cy.get("#onetrust-accept-btn-handler").click();
    }
  });
};
