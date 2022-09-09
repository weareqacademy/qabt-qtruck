class Modal {
    haveText(text) {
        cy.get('.swal2-html-container', { timeout: 10000 })
            .should('be.visible')
            .should('have.text', text)
    }
}

export default new Modal()