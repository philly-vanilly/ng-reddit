
describe('App', () => {
  beforeEach(() => cy.visit('/'));

  it('should display correct title', () => {
    cy.title().should('eq', 'helppit');
  });
});
