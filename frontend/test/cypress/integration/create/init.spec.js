describe("Create Poll page", () => {
  beforeEach(() => {
    cy.visit("/create");
  });

  it(".should() - assert that <title> is correct", () => {
    cy.get('#page-title').should("contain.text", "Create Poll");
  });

  it("let the user connect a wallet", () => {
    cy.get("#button--connect-wallet").click()
    cy.get('.bn-onboard-modal')
    // cy.connectWallet() // TODO
  });
});