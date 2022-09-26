import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Food e2e test', () => {
  const foodPageUrl = '/food';
  const foodPageUrlPattern = new RegExp('/food(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const foodSample = { name: 'deposit Qatari Toys', price: 55215, foodSize: 'MEDIUM' };

  let food;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/services/restobackend/api/foods+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/restobackend/api/foods').as('postEntityRequest');
    cy.intercept('DELETE', '/services/restobackend/api/foods/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (food) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/restobackend/api/foods/${food.id}`,
      }).then(() => {
        food = undefined;
      });
    }
  });

  it('Foods menu should load Foods page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('food');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Food').should('exist');
    cy.url().should('match', foodPageUrlPattern);
  });

  describe('Food page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(foodPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Food page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/food/new$'));
        cy.getEntityCreateUpdateHeading('Food');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', foodPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/restobackend/api/foods',
          body: foodSample,
        }).then(({ body }) => {
          food = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/restobackend/api/foods+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/services/restobackend/api/foods?page=0&size=20>; rel="last",<http://localhost/services/restobackend/api/foods?page=0&size=20>; rel="first"',
              },
              body: [food],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(foodPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Food page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('food');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', foodPageUrlPattern);
      });

      it('edit button click should load edit Food page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Food');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', foodPageUrlPattern);
      });

      it('edit button click should load edit Food page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Food');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', foodPageUrlPattern);
      });

      it('last delete button click should delete instance of Food', () => {
        cy.intercept('GET', '/services/restobackend/api/foods/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('food').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', foodPageUrlPattern);

        food = undefined;
      });
    });
  });

  describe('new Food page', () => {
    beforeEach(() => {
      cy.visit(`${foodPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Food');
    });

    it('should create an instance of Food', () => {
      cy.get(`[data-cy="name"]`).type('info-mediaries').should('have.value', 'info-mediaries');

      cy.get(`[data-cy="description"]`).type('Licensed Switzerland').should('have.value', 'Licensed Switzerland');

      cy.get(`[data-cy="price"]`).type('6097').should('have.value', '6097');

      cy.get(`[data-cy="foodSize"]`).select('MEDIUM');

      cy.setFieldImageAsBytesOfEntity('image', 'integration-test.png', 'image/png');

      // since cypress clicks submit too fast before the blob fields are validated
      cy.wait(200); // eslint-disable-line cypress/no-unnecessary-waiting
      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        food = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', foodPageUrlPattern);
    });
  });
});
