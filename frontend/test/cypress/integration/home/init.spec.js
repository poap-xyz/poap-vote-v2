import * as ctx from "../../../../quasar.conf.js";

describe("Home page", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it(".should() - assert that <title> is correct", () => {
    cy.title().should("include", "POAP Vote");
  });

  it("should have a link to the create poll page", () => {
    cy.get("#button--create-poll").click()
    cy.url().should('match', /create/)
  });
});
