

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

    goToFoodtruck(footruckName) {
        cy.get(`img[alt="${footruckName}"]`)
        .should('be.visible')
        .click({force: true})
    
    cy.get('.leaflet-popup-content a').click()
    }

}

export default new MapPage()