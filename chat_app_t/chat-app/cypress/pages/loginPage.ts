export class LoginPage {
  fillEmail(email: string) {
    cy.get('[data-testid="email-input"]').type(email);
  }

  fillPassword(password: string) {
    cy.get('[data-testid="password-input"]').type(password);
  }

  submit() {
    cy.get('[data-testid="login-button"]').click();
  }

  shouldRedirectedToHome() {
    cy.url({timeout:10000}).should('include', '/home');
  }
}
