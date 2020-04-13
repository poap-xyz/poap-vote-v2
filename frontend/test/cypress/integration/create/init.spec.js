describe("Create Poll page", () => {
  beforeEach(() => {
    cy.visit("/create");
  });

  it(".should() - assert that <title> is correct", () => {
    cy.get("#page-title").should("contain.text", "Create Poll");
  });

  it("lets the user connect a wallet", () => {
    cy.get("#button--connect-wallet").click();
    cy.get(".bn-onboard-modal");
    cy.connectWallet();
  });

  it("correctly validates form data", () => {
    // TODO this code needs to be fixed, as there are issues selecting
    // dropdown items from q-select with Quasar. See details at:
    // https://github.com/rmehner/quasar-select-cypress
    cy.connectWallet();
    // Button should be disabled
    cy.get("#createPoll-submit").get('button').should('have.class', 'non-selectable');
    // Fill out form
    cy.get("#createPoll-title").quasar('text', 'Is cereal a soup?');
    cy.get("#createPoll-description"); // Description is optional, so just make sure it exists
    cy.get("#createPoll-option-1").quasar('text', 'It is a soup');
    cy.get("#createPoll-option-2").quasar('text', 'Actually is is a salad');
    cy.get("#createPoll-addOption").get('button:first').click();
    cy.get("#createPoll-option-3").quasar('text', 'It is neither');
    // cy.get("#createPoll-selectEvents").quasar('select', 'solidity');
    cy.get("#createPoll-endDay").quasar('text', '2020/05/01');
    // cy.get("#createPoll-endHour").quasar('select');
    // cy.get("#createPoll-endMinute").quasar('select');
    // cy.get("#createPoll-endAmPm").quasar('select');
  });
});
