

describe('Avalidações', ()=> {

    it('deve enviar uma nova avaliação', ()=> {

        const user = {
            name: 'Madruga Ramon',
            instagram: '@madruguinha',
            password: 'pwd123'
        }

        const foodtruck = {
            latitude: '-23.584642248123703',
            longitude: '-46.67472571134568',
            name: 'Super de Quico',
            details: 'Sucos de alta qualidade direto do saquinho.',
            opening_hours: 'das 14h às 20h',
            open_on_weekends: false
        }

        cy.apiCreateUser(user)
        cy.apiLogin(user)
        cy.apiCreateFoodTruck(foodtruck)

        cy.uiLogin(user)

        cy.wait(10000)

    })

})