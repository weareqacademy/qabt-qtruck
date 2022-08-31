

class MapPage {

    loggedUser(name) {
        const firstName = name.split(' ')[0]

        cy.get('.logged-user')
            .should('be.visible')
            .should('have.text', `Olá, ${firstName}`)
    }

    createLink() {
        cy.get('a[href="/foodtrucks/create"]')
            .should('be.visible')
            .click()
    }

}

export default new MapPage()