import { makeSearch } from '@snx-v3/useParams';

describe(__filename, () => {
  Cypress.env('chainId', '8453');
  Cypress.env('preset', 'andromeda');
  Cypress.env('walletAddress', '0xc3Cf311e04c1f8C74eCF6a795Ae760dc6312F345');
  Cypress.env('accountId', '522433293696');

  beforeEach(() => {
    cy.task('startAnvil', {
      chainId: Cypress.env('chainId'),
      forkUrl:
        Cypress.env('RPC_BASE_MAINNET') ??
        `https://base-mainnet.infura.io/v3/${Cypress.env('INFURA_KEY')}`,
      block: '26833143',
    }).then(() => cy.log('Anvil started'));
    cy.pythBypass();

    cy.on('window:before:load', (win) => {
      win.localStorage.setItem('MAGIC_WALLET', Cypress.env('walletAddress'));
      win.localStorage.setItem(
        'DEFAULT_NETWORK',
        `${Cypress.env('chainId')}-${Cypress.env('preset')}`
      );
    });
  });
  afterEach(() => cy.task('stopAnvil').then(() => cy.log('Anvil stopped')));

  it(__filename, () => {
    cy.setEthBalance({ balance: 100 });
    cy.getUSDC({ amount: 1000 });
    cy.pmIncreasePosition({ symbol: 'stataUSDC', amount: 500 });

    cy.visit(
      `?${makeSearch({
        page: 'position',
        collateralSymbol: 'stataUSDC',
        manageAction: 'undelegate',
        accountId: Cypress.env('accountId'),
      })}`
    );

    cy.get('[data-cy="undelegate collateral form"]').should('exist');
    cy.get('[data-cy="locked amount"]', { timeout: 180_000 })
      .should('exist')
      .and('include.text', 'Max');

    cy.get('[data-cy="undelegate amount input"]').should('exist');
    cy.get('[data-cy="undelegate amount input"]').type('100');
    cy.get('[data-cy="undelegate submit"]').should('be.enabled');
    cy.get('[data-cy="undelegate submit"]').click();

    cy.get('[data-cy="undelegate dialog"]')
      .should('exist')
      .and('include.text', 'Unlocking Collateral')
      .and('include.text', 'Unlocking 100 Static aUSDC');

    cy.contains('[data-status="success"]', 'Your collateral has been updated', {
      timeout: 180_000,
    }).should('exist');
    cy.get('[data-cy="transaction hash"]').should('exist');

    cy.get('[data-cy="undelegate dialog"]')
      .should('exist')
      .and('include.text', 'Unlocked 100 Static aUSDC');

    cy.contains('[data-cy="undelegate dialog"] button', 'Done').click();

    cy.get('[data-cy="undelegate submit"]').should('be.disabled');
  });
});
