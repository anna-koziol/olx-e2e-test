/// <reference types="cypress" />
import { openOlx } from "./common.cy";

describe("search box on the main page has the correct behavior", () => {
  let data: { searchEntries: string[] };

  beforeEach(() => {
    openOlx();

    //// GIVEN collection with a list of phases to search
    cy.fixture("dataFixtures").then(function (dataFixtures) {
      data = dataFixtures;
    });
  });

  // type in search bar (X icon is visible and search button is active)
  it("type in search bar (X icon is visible and search button is active)", () => {
    //// THEN search field is displayed
    cy.getAndCheckVisible("#searchmain", true).within(($form) => {
      //// AND icon to clear typed text is hidden
      cy.get(".clear-input-button").should("not.be.visible");
      //// AND submit button is not focused
      cy.getByData("homepage_button_search")
        .parent()
        .should("not.have.class", "is-focused");

      //// THEN text filed in search field is displayed
      cy.get(".fquery").within(() => {
        //// WHEN I typed there some random phase
        cy.getAndCheckVisible("homepage_input_textsearch", false)
          .type(
            data.searchEntries[
              Cypress._.random(0, data.searchEntries.length - 1)
            ]
          )
          //// THEN clear button to remove typed value is displayed
          .then(() => {
            cy.getAndCheckVisible(".clear-input-button", true);
          });
      });

      //// AND submit button is focused
      cy.getByData("homepage_button_search")
        .parent()
        .should("have.class", "is-focused");
      cy.scrollTo(0, 0);

      //// WHEN I click button to remove filled value
      cy.wrap($form)
        .find("a.clear-input-button")
        .first()
        .should("be.visible")
        .click();

      //// THEN submit button is not focused
      cy.getByData("homepage_button_search")
        .parent()
        .should("not.have.class", "is-focused");
    });
  });

  // search something
  it("search something", () => {
    //// GIVEN random search phrase
    const searchValue =
      data.searchEntries[Cypress._.random(0, data.searchEntries.length - 1)];

    // to finish
    // cy.intercept({
    //   method: "POST",
    //   url: "https://www.olx.pl/api/v1/offers/?offset=0&limit=40&query=kot%20ragdoll2&region_id=3&filter_refiners=spell_checker&suggest_filters=true&sl=18af1698903x2b7fe335",
    // }).as("apiCheck");

    //// THEN search field is displayed
    cy.getAndCheckVisible("#searchmain", true).within(($form) => {
      cy.get(".fquery").within(() => {
        cy.scrollTo(0, 0);

        /// WHEN I type random phrase to search field
        cy.getAndCheckVisible("homepage_input_textsearch", false).type(
          searchValue
        );
        //// AND I select some random region
        cy.wrap($form)
          .find("#cityField")
          .click()
          .then(() => {
            cy.wrap($form)
              .find("#proposalContainer")
              .should("not.have.class", "hidden")
              .within(($ul) => {
                cy.get(".regionsList")
                  .children("li")
                  .then(($liItems) => {
                    length = $liItems.length;
                    cy.wrap($liItems)
                      .eq(Cypress._.random(0, length - 1))
                      .click();
                  });
              });
          });
      });

      //// AND I click search submit button
      cy.getByData("homepage_button_search")
        .parent()
        .should("have.class", "is-focused")
        .click();

      //// THEN subpage should be opened on the link containing the searched element
      cy.url().should("contain", searchValue.replace(/\s+/g, "-"));

      // to finish
      /*
      cy.wait("@apiCheck", { responseTimeout: 80000 })
        .should("have.property", "response.statusCode", 200)
        .then((interception) => {
          assert.isNotNull(interception.response.body, "1st API call has data");
        });
        */
    });
  });
});
