# E2E tests for olx.pl platform

E2E tests of the https://www.olx.pl/ platform including several scripts concerning: displaying basic sections and items on the home page and searching for things.

## Content

The code responsible for the tests was divided into two files. File **mainpage.cy.ts** contains tests to check whether the main elements are displayed on the main page. File **search.cy.ts** contains tests for searching a random phrase with a random region.

## Versions

The project is maintained with:

- Cypress 12.17.4
- TypeScript 5.1.6
- Node 16.17.1

## Launching

```sh
cd ./olx-e2e-test-main
npx cypress open
```
