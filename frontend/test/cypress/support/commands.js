// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('connectWallet', () => {
  cy.window().its('app.store').then(store => {
    store.commit('user/setWallet', {
      // Simulate connecting wallet by setting provider/signer/address to strings.
      // This tricks the UI into thinking a wallet is connected
      signer: '0x',
      provider: '0x',
      ethersProvider: '0x',
      userAddress: '0x',
    })
  })
})

Cypress.Commands.add('getStore', () => {
  cy.window().its('app.store')
})

Cypress.Commands.add('getRouter', () => {
  cy.window().its('app.router')
})


// ============================ Commands below here were pre-populated =============================

// these two commands let you persist local storage between tests
const LOCAL_STORAGE_MEMORY = {};

Cypress.Commands.add('saveLocalStorage', () => {
  Object.keys(localStorage).forEach((key) => {
    LOCAL_STORAGE_MEMORY[key] = localStorage[key];
  });
});

Cypress.Commands.add('restoreLocalStorage', () => {
  Object.keys(LOCAL_STORAGE_MEMORY).forEach((key) => {
    localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key]);
  });
});

// CHAINABLE QUASAR INPUT FIELD TYPES
// usage:
//
// cy.get('[data-cy=target-element]').quasar('text', '');
//
// todo: make sure that this is still compliant with 1.0
//
Cypress.Commands.add('testRoute', (route) => {
  cy.location().should((loc) => {
    expect(loc.hash).to.contain(route);
  });
});

Cypress.Commands.add('quasar', { prevSubject: 'element' }, (subject, mode, option) => {
  if (mode === 'select') {
    cy.wrap(subject)
      .invoke('show')
      .click({ force: true })
      .then(() => {
        cy.get('.q-popover')
          .contains(option)
          .click();
      });
  } else if (mode === 'grid') {
    cy.wrap(subject).within(() => {
      cy.get('input').click({ force: true, multiple: true });
    });
  } else if (mode === 'tag-list') {
    Object.keys(option)
      .forEach((x) => {
        cy.wrap(subject)
          .within(() => {
            cy.get('input')
              .first()
              .type(`${option[x]}{enter}`);
          });
      });
  } else {
    cy.wrap(subject)
      .invoke('show')
      .within(($subject) => { // eslint-disable-line
        switch (mode) {
          case 'date':
          case 'text':
          case 'email':
            cy.get('input:first')
              .type(option)
              .should('have.value', option);
            break;
          case 'textarea':
            cy.get('textarea:first')
              .type(option)
              // .should('have.value', option); // TODO does not work
              break
          case 'radio':
          case 'checkbox':
            cy.contains(option)
              .click();
            break;
          case 'select':
            // TODO
            break
          default:
            break;
        }
      });
  }
});

// Cypress.Commands.add('loadStore', () => {});
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
