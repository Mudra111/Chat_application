// cypress/support/index.d.ts

declare namespace Cypress {
  interface Chainable<Subject = any> {
    visitRoute(route: string): Chainable<null>;
  }
}
