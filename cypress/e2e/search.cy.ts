/// <reference types="cypress" />

describe("display main elements", () => {
  let data;

  beforeEach(() => {
    cy.visit("https://www.olx.pl/");

    cy.get("body").then(($body) => {
      if ($body.find("#onetrust-banner-sdk").length > 0) {
        cy.get("#onetrust-accept-btn-handler").click();
      }
    });

    cy.fixture("dataFixtures").then(function (dataFixtures) {
      data = dataFixtures;
    });
  });

  it("type in search bar (X icon is visible and search button is active)", () => {
    cy.get("#searchmain")
      .should("be.visible")
      .within(($form) => {
        cy.get(".clear-input-button").should("not.be.visible");
        cy.getByData("homepage_button_search")
          .parent()
          .should("not.have.class", "is-focused");

        cy.get(".fquery").within(() => {
          cy.getByData("homepage_input_textsearch")
            .should("be.visible")
            .type(
              data.searchEntries[Cypress._.random(0, data.searchEntries.length)]
            )
            .then(() => {
              cy.get(".clear-input-button").should("be.visible");
            });
        });

        cy.getByData("homepage_button_search")
          .parent()
          .should("have.class", "is-focused");
        cy.scrollTo(0, 0);

        cy.wrap($form)
          .find("a.clear-input-button")
          .first()
          .should("be.visible")
          .click();

        cy.getByData("homepage_button_search")
          .parent()
          .should("not.have.class", "is-focused");
      });
  });

  it.only("search something", () => {
    const searchValue =
      data.searchEntries[Cypress._.random(0, data.searchEntries.length)];

    cy.intercept({
      method: "POST",
      url: "https://www.olx.pl/api/v1/offers/?offset=0&limit=40&query=kot%20ragdoll2&region_id=3&filter_refiners=spell_checker&suggest_filters=true&sl=18af1698903x2b7fe335",
    }).as("apiCheck");

    cy.get("#searchmain")
      .should("be.visible")
      .within(($form) => {
        cy.get(".fquery").within(() => {
          cy.scrollTo(0, 0);
          cy.getByData("homepage_input_textsearch")
            .should("be.visible")
            .type(searchValue);
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

        cy.getByData("homepage_button_search")
          .parent()
          .should("have.class", "is-focused")
          .click();

        cy.url().should("contain", searchValue.replace(/\s+/g, "-"));

        cy.wait("@apiCheck", { responseTimeout: 80000 })
          .should("have.property", "response.statusCode", 200)
          .then((interception) => {
            assert.isNotNull(
              interception.response.body,
              "1st API call has data"
            );
          });
      });
  });
});
