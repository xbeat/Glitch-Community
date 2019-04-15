/// <reference types="Cypress" />

context('Home Page', () => {
  before(() => {
    cy.server()
    cy.route('POST', 'https://api.glitch.com/email/sendLoginEmail', {})
    cy.route('POST', 'https://api.glitch.com/auth/email/*', 'fixture:auth')
  })

  it('Signing In', () => {
    cy.visit('/')

    cy.get('.what-is-glitch').should('exist')

    cy.contains('Sign in').click()
    cy.contains('Sign in with Email').click()
    cy.get('.pop-over input').type('olivia@glitch.com')
    cy.contains('Send Link').click()
    cy.contains('Use a sign in code').click()
    cy.get('.pop-over input').type('any-three-words')
    cy.get('form > .button-small').click()

    cy.get('.profile').should('contain', 'Your Projects')
  })

  it('Signing Out', () => {
    cy.signIn()

    cy.visit('/')

    cy.get('.profile').should('contain', 'Your Projects')

    cy.get('[data-tooltip="User options"]').click()
    cy.contains('Sign Out').click()

    cy.get('.what-is-glitch').should('exist')
  })
})
