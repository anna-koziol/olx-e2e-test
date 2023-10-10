/// <reference types="cypress" />
import { openOlx } from "./common.cy";

describe("display main elements", () => {
  beforeEach(() => openOlx());

  // displays search bar on mainpage
  it("displays search bar on mainpage", () => {
    //// GIVEN I am on mainpage
    //// THEN search filed is displayed
    cy.getAndCheckVisible("#searchmain", true).within(() => {
      //// THEN text field to search with search icon is displayed
      cy.get(".fquery").within(() => {
        cy.getAndCheckVisible("homepage_input_textsearch", false);
        cy.getAndCheckVisible('[data-icon="search"]', true);
      });
      //// AND select for location with location icon is displayed
      cy.get("#locationBox").within(() => {
        cy.getAndCheckVisible("homepage_input_locationsearch", false);
        cy.getAndCheckVisible('[data-icon="location"]', true);
      });
      //// AND search submit button displayed
      cy.get(".button.fright").within(() => {
        cy.getAndCheckVisible("homepage_button_search", false);
        cy.getAndCheckVisible('[data-icon="search"]', true);
      });
    });
  });

  // displays categories on mainpage
  it("displays categories on mainpage", () => {
    //// GIVEN I am on mainpage
    //// THEN container main categories is displayed
    cy.get(".maincategories").within(() => {
      //// THEN it contains items with categories
      cy.getAndCheckVisible(".maincategories-list", true).each(
        (items, index) => {
          expect(items).to.exist;

          //// AND they contain link to subpage with their category
          cy.wrap(items)
            .find(".item")
            .each((item, index) => {
              cy.wrap(item)
                .should("have.descendants", "a")
                .find("a")
                .should("have.attr", "href")
                .and("include", "https://www.");
              //.and("include", "https://www.olx.pl/"); some category has a link to external promoted sites
            });
        }
      );
    });
  });

  // displays promoted ads and add to favorites on mainpage, which is then displayed on the favorite list
  it("displays promoted ads and add to favorites on mainpage, which is then displayed on the favorite list", () => {
    //// GIVEN I am on mainpage
    //// THEN promoted ads section is displayed
    cy.get("#mainpageAds > #gallerywide")
      .children("li")
      //// AND ads conatin values
      .each((ad, index) => {
        cy.wrap(ad).children("div .date-location").should("not.be.empty");
      });

    //// THEN promoted ads elements have button to add to observe list
    cy.get("#mainpageAds > #gallerywide li")
      .find(".observelinkgallery")
      .then((listing) => {
        const listingCount: number = Cypress.$(listing).length;
        expect(listing).to.have.length(listingCount);
        const random: number = Math.floor(Math.random() * (listingCount - 1));

        let favPrice: string = "";
        let favTitle: string = "";
        cy.scrollTo(0, 0);

        //// WHEN I add to observe list some random item
        cy.get(".observelinkgallery")
          .eq(random)
          .should("exist")
          .click()
          .then((fav) => {
            cy.scrollTo(0, 0);

            cy.wrap(fav.parent()).then((f) => {
              favTitle = f.find("h4").text().trim();
              favPrice = f.find(".price").text().trim();
              //// THEN confirmation message appears
              cy.getAndCheckVisible("#fancybox-wrap", true)
                .contains("Ogłoszenie dodane do obserwowanych")
                .then(() => {
                  cy.get("#fancybox-close").click();
                });

              ////  WHEN I click navbar option to open observed list
              cy.scrollTo(0, 0);
              cy.get(".navi #observed-counter").click();
              cy.url().should("include", "/obserwowane");
              //// THEN list contains one observed item
              cy.get('[data-testid="select-ads"]').contains("1/");
              cy.get('[data-cy="observed-list"] > div')
                .children()
                .should("have.length", 1)
                .then(() => {
                  cy.get('[data-testid="adRemoveFromFavorites"]')
                    .parent()
                    .then((addedFav) => {
                      let addedFavTitle: string = addedFav
                        .find("h6")
                        .text()
                        .trim();
                      let addedfavPrice: string = addedFav
                        .find('[data-testid="ad-price"]')
                        .text()
                        .trim();
                      //// AND this observed item has the same data as clicked one previous
                      expect(favTitle).equal(addedFavTitle);
                      expect(favPrice).equal(addedfavPrice);
                    });
                });
            });
          });
      });
  });

  // displays button to add an ad on mainpage
  it("displays button to add an ad on mainpage", () => {
    //// GIVEN I am on mainpage
    //// THEN button to add a new ad is displayed
    cy.getAndCheckVisible("common_link_header_postnewad", false)
      //// AND it includes link to subpage to add a new ad
      .and("have.attr", "href")
      .and(
        "include",
        "https://www.olx.pl/d/nowe-ogloszenie/?bs=homepage_adding"
      );
  });
});
