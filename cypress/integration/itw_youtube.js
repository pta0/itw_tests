describe(`after visiting youtube webpage, clicking on ["J'accepte"] button, filling ["Recherche"] input and keypressing ["enter"] button`, () => {
  let db_search_data
  before(() => {
    cy.visit('/')
    cy.get('ytd-button-renderer:contains("accept")').click()
    cy.intercept('POST', `**search?key=**`).as('getSearch')
    cy.get('input[id="search"]').type('inqom{enter}').wait('@getSearch').then(r => {
      db_search_data = r["response"]["body"]
    })
  })
  it("_search results displays inqom ceo name", () => {
    const data = Cypress.findAllByKey(db_search_data, "text")
    const ceo_name = "passilly"
    expect(data.join(' [*__*] ').toLowerCase()).to.includes(ceo_name)
  })
})