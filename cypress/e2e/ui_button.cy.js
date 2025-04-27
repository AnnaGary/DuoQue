describe('Navbar Navigation Tests', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000');
    });
  
    it('navigates to Home page', () => {
      cy.contains('Home').click();
      cy.url().should('match', /\/$/);
    });
  
    it('navigates to Login page', () => {
      cy.contains('Login').click();
      cy.url().should('include', '/login');
    });
  
    it('navigates to About page', () => {
      cy.contains('About').click();
      cy.url().should('include', '/about');
    });
  
    it('navigates to Admin page (expect redirect)', () => {
      cy.contains('Admin').click();
      cy.url().should('include', '/login');
    });
  
    it('navigates to Explore page', () => {
      cy.contains('Explore').click();
      cy.url().should('include', '/explore');
    });
  });
  