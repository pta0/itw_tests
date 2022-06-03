describe(`after visiting ["www.welcometothejungle.com/fr/me/settings/account"] webpage, clicking on ["Se connecter"] button, filling ["Email", "Mot de passe"] inputs, clicking ["Se connecter"] button, filling ["Photo de profil"] input and clicking on ["OK"] button`, () => {
  before(() => {
    cy.visit('fr/me/settings/account')

    // login
    cy.fixture('./ids/data.json')
      .then(data => {
        cy.log(data.email)
        cy.get('input[data-testid="login-field-email"]')
          .type(data.email)
        cy.get('input[data-testid="login-field-password"]')
          .type(data.password)
      })
    cy.get('button[data-testid="login-button-submit"]')
      .click()
  })

  after(() => {
    //remove profile avatar
    cy.get('body')
      .then((body) => {
        const svgTrashIcon = 'svg[alt="Trash"]'
        if (body.find(svgTrashIcon).length > 0) {
          //click on trash button
          cy.get(svgTrashIcon)
            .parent()
            .click();
        }
      })

  })

  it("_profile-avatar data are updated", () => {
    //upload avatar
    cy.fixture('./img/inqom.png')
      .then((avatar) => {
        cy.get('body')
          .attachFiles('input[name="avatar"]', avatar)
      })

    //monitor api response
    const registrationsApi = 'https://api.welcometothejungle.com/api/v1/registrations'
    cy.intercept('PUT', registrationsApi)
      .as('registrations');

    //save page modifications
    cy.get('button[data-testid="account-edit-button-submit"]')
      .click()

    //check registration api response for avatar
    cy.wait('@registrations')
      .its('response.body.user.avatar')
      .should('not.be.empty')

  })
})



