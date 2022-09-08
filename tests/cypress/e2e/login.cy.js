import loginPage from '../support/pages/Login'
import mapPage from '../support/pages/Map'

describe('Login', () => {

  beforeEach(()=> {
    cy.fixture('login-users').then(function (users){
      this.users = users
    })
  })

  it.only('deve logar com sucesso', function () {

    const user = this.users.success

    cy.apiCreateUser(user)

    loginPage.go()
    loginPage.form(user)
    loginPage.submit()

    mapPage.loggedUser(user.name)
  })

  it('nao deve logar com senha invalida', function () {
    const user = this.users.inv_pass

    loginPage.go()
    loginPage.form(user)
    loginPage.submit()

    loginPage.modal.haveText('Credenciais inválidas, tente novamente!')
  })

  it('nao deve logar instagram inexistente', function () {
    const user = this.users.not_found

    loginPage.go()
    loginPage.form(user)
    loginPage.submit()

    loginPage.modal.haveText('Credenciais inválidas, tente novamente!')
  })

  it('instagram deve ser obrigatório', function () {
    const user = this.users.required_insta

    loginPage.go()
    loginPage.form(user)
    loginPage.submit()

    loginPage.modal.haveText('Por favor, informe o seu código do Instagram!')
  })

  it('senha deve ser obrigatória', function () {
    const user = this.users.required_pass

    loginPage.go()
    loginPage.form(user)
    loginPage.submit()

    loginPage.modal.haveText('Por favor, informe a sua senha secreta!')
  })

  it('todos os campos devem ser obrigatórios', function () {
    loginPage.go()
    loginPage.submit()

    loginPage.modal.haveText('Por favor, informe suas credenciais!')
  })
})
