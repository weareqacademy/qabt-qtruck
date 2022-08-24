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
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import loginPage from './pages/Login'
import mapPage from './pages/Map'

Cypress.Commands.add('apiResetUser', (instagram) => {
    cy.request({
        url: 'http://localhost:3333/helpers-reset',
        method: 'DELETE',
        qs: { instagram: instagram }
    }).then(response => {
        expect(response.status).to.eql(204)
    })
})

Cypress.Commands.add('apiCreateUser', (payload)=> {
    cy.apiResetUser(payload.instagram)

    cy.request({
        url: 'http://localhost:3333/signup',
        method: 'POST',
        body: payload
    }).then(response => {
        expect(response.status).to.eql(201)
    })
})

Cypress.Commands.add('uiLogin', (user)=> {
    loginPage.go()
    loginPage.form(user)
    loginPage.submit()

    mapPage.loggedUser(user.name)
})

Cypress.Commands.add('setGeolocation', (lat, long)=> {
    localStorage.setItem('qtruck:latitude', lat)
    localStorage.setItem('qtruck:longitude', long)
})
