/// <reference types="Cypress" />

context('User Profile', () => {
  before(() => {
    const fixtures = {
      'userById': 'https://api.glitch.com/users/3803619',
      'boot': 'https://api.glitch.com/boot?latestProjectOnly=true',
      'userByLogin': 'https://api.glitch.com/v1/users/by/login?login=olivia',
      'userByLoginProjects': 'https://api.glitch.com/v1/users/by/login/projects?login=olivia&limit=100&orderKey=createdAt&orderDirection=DESC',
      'projectsByIds': 'https://api.glitch.com/v1/projects/by/id?id=bb1b306f-168a-48fa-9122-6e9b70338539&id=03038247-4bd7-49ed-b1d8-d38e8f129fae&id=8d757f7b-44ee-4381-a997-e07b0b79f5d6&id=b2816e92-bf31-438f-92b9-c5c37c7e2d89&id=7953ab19-7aac-47bf-9559-282aabebbb68&id=804c9788-2380-454d-9d34-57e09ff3c694&id=39675ff9-fd09-49d4-8059-1c8dba72a1f7&id=6429e37b-88ed-4a7c-823e-fe0b09c28f99&id=0e8bd3d9-5fdb-4592-911b-c1e30b8e652f&id=ad75e8b2-3361-481c-8ba0-aa65bff57460&id=89412c50-a160-4723-ae79-964b05cda484&id=349c8d44-934f-4733-b4af-f080b7e3958e&id=802867ea-9916-4c64-a193-37701160c455',
      'deletedProjects': 'https://api.glitch.com/user/deleted-projects',
    }
    // cy.createFixtures(fixtures)
  })

  beforeEach(() => {
    cy.server()
    cy.route('GET', 'https://api.glitch.com/v1/teams/by/url?url=*', {})
    cy.route('GET', 'https://api.glitch.com/boot?latestProjectOnly=true', 'fixture:boot')
    cy.route('GET', 'https://api.glitch.com/users/*', 'fixture:userById')
    cy.route('GET', 'https://api.glitch.com/v1/users/by/login?login=*', 'fixture:userByLogin')
    cy.route('GET', 'https://api.glitch.com/v1/users/by/login/projects?login*', 'fixture:userByLoginProjects')
    cy.route('GET', 'https://api.glitch.com/v1/projects/by/id*', 'fixture:projectsByIds')
    cy.route('GET', 'https://api.glitch.com/user/deleted-projects', 'fixture:deletedProjects')
    cy.route('PATCH', 'https://api.glitch.com/users/3803619', { featuredProjectId: "a122f2b2-8a43-41b7-a1db-35237223a45e" })
    cy.route({
      method: 'DELETE',
      url: 'https://api.glitch.com/projects/*',
      response: 'OK',
      delay: 3000,
    }).as('deleteProject')
  })

  it('Featuring Projects', () => {
    cy.signIn()
  
    cy.visit('/@olivia')

    cy.get('.projects')
      .should('contain', 'Recent Projects')
      .should('contain', '1 / 3')
      .should('contain', 'Show all')
      .should('contain', '13')

    cy.get('.projects-container > :nth-child(1)').within(() => {
      cy.get('.project-options').click()
      cy.contains('Feature').click()
    })

    cy.get('.projects')
      .should('contain', 'Recent Projects')
      .should('contain', '1 / 2')
      .should('contain', 'Show all')
      .should('contain', '12')

    cy.get('.profile-page').should('contain', 'Featured Project')
  })

  describe('Recent Projects', () => {
    it('Deleting Projects', () => {
      cy.signIn()
    
      cy.visit('/@olivia')

      cy.get('.projects')
        .should('contain', 'Recent Projects')
        .should('contain', '1 / 3')
        .should('contain', 'Show all')
        .should('contain', '13')

      cy.get('.projects-container > :nth-child(1)').within(() => {
        cy.get('.project-options').click()
        cy.contains('Delete Project').click()
      })

      cy.get('.projects-container > :nth-child(2)').within(() => {
        cy.get('.project-options').click()
        cy.contains('Delete Project').click()
      })

      cy.wait('@deleteProject')
      cy.wait('@deleteProject')

      cy.get('.projects')
        .should('contain', 'Recent Projects')
        .should('contain', '1 / 2')
        .should('contain', 'Show all')
        .should('contain', '11')
    })
  })
})
