describe('browser navigation', () => {
  it('should redirect to forward and backward using browser navigation', () => {
    cy.visitRoute('/login');

    cy.screenshot();

    cy.get('#register').click();
    cy.url({ timeout: 10000 }).should('include', '/register');

    cy.go('back');
    cy.url({ timeout: 20000 }).should('include', '/login');

    cy.go('forward');
    cy.url({ timeout: 30000 }).should('include', '/register');
  });
});
