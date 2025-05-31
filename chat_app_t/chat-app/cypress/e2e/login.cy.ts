import { LoginPage } from 'cypress/pages/loginPage';

const loginPage = new LoginPage();
describe('Login Page', () => {
  it('should show validation message when inputs are empty and form is submitted', () => {
    cy.visitRoute('/login');

    cy.get('[data-testid="email-input"]').focus();
    cy.get('[data-testid="password-input"]').focus();

    cy.contains('Email is required!!').should('be.visible');

    cy.get('[data-testid="email-input"]').focus();

    cy.contains('Password is required!!').should('be.visible');
  });

  it('should not login', () => {
    cy.visitRoute('/login');

    loginPage.fillEmail('xy@gmail.com');
    loginPage.fillPassword('Xyz@1234');

    loginPage.submit();

    cy.on('window:alert', (text) => {
      expect(text).to.contains('Login Failed :');
    });
  });

  it('should open login page and login to chat application', () => {
    cy.visitRoute('/login');

    loginPage.fillEmail('xyz@gmail.com');
    loginPage.fillPassword('Xyz@1234');

    loginPage.submit();

    cy.on('window:alert', (text) => {
      expect(text).to.contains('Logged in Successfully');
    });

    loginPage.shouldRedirectedToHome();

    cy.get('app-header', { timeout: 10000 }).should('be.visible');
    cy.get('app-header .navbar .navbar-item .name', { timeout: 10000 }).should(
      'contain',
      'mudra'
    );
  });
});
