
import mapPage from '../support/pages/Map'

describe('Recomendação', () => {

    it('deve recomendar um food truck', () => {

        const user = {
            name: 'Benson',
            instagram: '@benson',
            password: 'pwd123'
        }

        const foodtruck = {
            latitude: '-23.584548837854058',
            longitude: '-46.674446913517876',
            name: 'Tienda Del Chavo',
            description: 'O melhor lugar para tomar o suco de limão que parece de groselha e tem sabor de tamarindo.',
            opening_hours: 'das 14h às 20h'
        }

        cy.apiCreateUser(user)
        cy.uiLogin(user)

        mapPage.createLink()
        cy.setGeolocation(foodtruck.latitude, foodtruck.longitude)


        cy.wait(30000)

    })

})