/// <reference types="cypress" />

describe("display main elements", () => {
  beforeEach(() => {
    cy.visit("https://www.olx.pl/");

    cy.get("body").then(($body) => {
      if ($body.find("#onetrust-banner-sdk").length > 0) {
        cy.get("#onetrust-accept-btn-handler").click();
      }
    });
  });

  it("displays search bar", () => {
    cy.get("#searchmain")
      .should("be.visible")
      .within(() => {
        cy.get(".fquery").within(() => {
          cy.getByData("homepage_input_textsearch").should("be.visible");
          cy.get('[data-icon="search"]').should("be.visible");
        });
        cy.get("#locationBox").within(() => {
          cy.getByData("homepage_input_locationsearch").should("be.visible");
          cy.get('[data-icon="location"]').should("be.visible");
        });
        cy.get(".button.fright").within(() => {
          cy.getByData("homepage_button_search").should("be.visible");
          cy.get('[data-icon="search"]').should("be.visible");
        });
      });
  });
  it("displays categories", () => {
    cy.get(".maincategories").within(() => {
      cy.get(".maincategories-list")
        .should("be.visible")
        .each((items, index) => {
          expect(items).to.exist;

          cy.wrap(items)
            .find(".item")
            .each((item, index) => {
              cy.wrap(item)
                .should("have.descendants", "a")
                .find("a")
                /*.then((page) => {
                  cy.request(page.prop("href"), { failOnStatusCode: false });
                  cy.request({
                    url: page.prop("href"),
                    failOnStatusCode: false,
                  });
                })*/
                .should("have.attr", "href")
                .and("include", "https://www.olx.pl/");
            });
        });
    });
  });
  it("displays promoted ads and add to favorites", () => {
    cy.get("#mainpageAds > #gallerywide")
      .children("li")
      .each((ad, index) => {
        cy.wrap(ad).children("div .date-location").should("not.be.empty");
        //cy.wrap(ad).children("div .price").should("contain", "zł");
        //cy.wrap(ad).children("div .observelinkgallery").should("exist").click();
      });

    cy.get("#mainpageAds > #gallerywide li")
      .find(".observelinkgallery")
      .then((listing) => {
        const listingCount = Cypress.$(listing).length;
        expect(listing).to.have.length(listingCount);
        const random = Math.floor(Math.random() * listingCount);

        let favPrice = "";
        let favTitle = "";
        //let favCity = "";
        cy.scrollTo(0, 0);

        cy.get(".observelinkgallery")
          .eq(random)
          .should("exist")
          .click()
          .then((fav) => {
            cy.scrollTo(0, 0);

            cy.wrap(fav.parent()).then((f) => {
              favTitle = f.find("h4").text().trim();
              favPrice = f.find(".price").text().trim();

              cy.get("#fancybox-wrap")
                .should("be.visible")
                .contains("Ogłoszenie dodane do obserwowanych")
                .then(() => {
                  cy.get("#fancybox-close").click();
                });

              cy.scrollTo(0, 0);
              cy.get(".navi #observed-counter").click();
              cy.url().should("include", "/obserwowane");
              cy.get('[data-testid="select-ads"]').contains("1/");
              cy.get('[data-cy="observed-list"] > div')
                .children()
                .should("have.length", 1)
                .then(() => {
                  cy.get('[data-testid="adRemoveFromFavorites"]').parent();

                  cy.get('[data-testid="adRemoveFromFavorites"]')
                    .parent()
                    .then((addedFav) => {
                      let addedFavTitle = addedFav.find("h6").text().trim();
                      let addedfavPrice = addedFav
                        .find('[data-testid="ad-price"]')
                        .text()
                        .trim();

                      expect(favTitle).equal(addedFavTitle);
                      expect(favPrice).equal(addedfavPrice);
                    });
                });
            });
          });
      });
  });

  it.only("displays button to add ad", () => {
    cy.getByData("common_link_header_postnewad")
      .should("be.visible")
      .and("have.attr", "href")
      .and(
        "include",
        "https://www.olx.pl/d/nowe-ogloszenie/?bs=homepage_adding"
      );
  });
});
