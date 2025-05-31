import { LoginPage } from 'cypress/pages/loginPage';

const loginPage = new LoginPage();

describe('log in log out process', () => {
  it('should log in and log out successfully', () => {
    cy.fixture('loginData').then((data) => {
      data.forEach((data: any) => {
        cy.visitRoute('/login');
        loginPage.fillEmail(data.email);
        loginPage.fillPassword(data.password);
        loginPage.submit();

        if (data.email === 'xyz@gmail.com' && data.password === 'Xyz@1234') {
          loginPage.shouldRedirectedToHome();

          cy.get('app-header', { timeout: 10000 }).should('be.visible');
          cy.get('app-header .navbar .navbar-item .name', {
            timeout: 10000,
          }).should('contain', 'mudra');

          cy.reload({ timeout: 20000 });

          cy.get('app-header .navbar .navbar-item .name', {
            timeout: 20000,
          }).should('contain', 'mudra');

          cy.get('#logoutBtn', { timeout: 30000 }).click();
          cy.url({ timeout: 30000 }).should('include', '/login');
        } else {
          cy.url({ timeout: 30000 }).should('include', '/login');
        }
      });
    });
  });
});
