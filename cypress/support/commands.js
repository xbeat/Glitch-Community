// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add("createFixture", (name, url) => cy.request({ url, headers: { Authorization: "40decddb-5b0c-4963-8855-44b54d043dc7" } }).then((response) => cy.writeFile(`cypress/fixtures/${name}.json`, response.body)))

Cypress.Commands.add("createFixtures", (fixtures) => Object.entries(fixtures).forEach(entry => cy.createFixture(entry[0], entry[1])))

Cypress.Commands.add("signIn", () => cy.fixture('auth').then(auth => window.localStorage.setItem('cachedUser', JSON.stringify(auth))))

//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
