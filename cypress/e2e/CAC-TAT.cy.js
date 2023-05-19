/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', () => {

  beforeEach(() => {
    cy.visit('./src/index.html')
  })

  it('verifica o título da aplicação', () => {
    cy.title().should('eq', 'Central de Atendimento ao Cliente TAT')
  })

  it('preenche os campos obrigatórios e envia o formulário', () => {
    cy.get('#firstName').type('Eduardo')
    cy.get('#lastName').type('Crepaldi', { log: false })
    cy.get('#email').type('eduardo@teste.com')
    cy.get('#open-text-area').type('Meu primeiro teste automatizado no curso de Cypress com Walmlyr ', { delay: 0 })
    cy.get('button[type="submit"]').click()
    cy.get('.success').should('be.visible')
  })

  it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
    cy.get('#firstName').type('Eduardo')
    cy.get('#lastName').type('Crepaldi')
    cy.get('#email').type('eduardo@falta')
    cy.get('#open-text-area').type('Meu primeiro teste automatizado no curso de Cypress com Walmlyr ', { delay: 0 })
    cy.get('button[type="submit"]').click()
    cy.get('.error').should('be.visible')
    cy.get('.error').should('be.visible')
  })

  it('verifica se o campo telefone só aceita numero', () => {
    cy.get('#phone')
      .type('Eduardo')
      .should('have.value', '')
      .type('!@#$%%(*()*(')
      .should('have.value', '')
  })

  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
    cy.get('#firstName').type('Eduardo')
    cy.get('#lastName').type('Crepaldi')
    cy.get('#email').type('eduardo@teste.com')
    cy.get('#open-text-area').type('Meu primeiro teste automatizado no curso de Cypress com Walmlyr ', { delay: 0 })
    cy.get('#phone-checkbox').check()
    cy.get('button[type="submit"]').click()
    cy.get('span[class="phone-label-span required-mark"]').should('be.visible')
    cy.get('.error').should('be.visible')
  })

  it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
    cy.get('#firstName')
      .type('Eduardo')
      .should('have.value', 'Eduardo')
      .clear()
      .should('have.value', '')

    cy.get('#lastName')
      .type('Crepaldi')
      .should('have.value', 'Crepaldi')
      .clear()
      .should('have.value', '')

    cy.get('#email')
      .type('eduardo@teste.com')
      .should('have.value', 'eduardo@teste.com')
      .clear()
      .should('have.value', '')

    cy.get('#phone')
      .type('78662155')
      .should('have.value', '78662155')
      .clear()
      .should('have.value', '')
  })

  it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
    cy.get('button[type="submit"]').click()
    cy.get('.error').should('be.visible')
  })

  it('envia o formuário com sucesso usando um comando customizado', () => {
    const user = {
      name: 'Eduardo',
      lastName: 'Crepaldi',
      email: 'edu@teste.com',
      areaText: 'Meu primeiro teste automatizado no curso de Cypress com Walmlyr '
    }
    cy.fillMandatoryFieldsAndSubmit(user)
    cy.get('.success').should('be.visible')
  })

  it('envia o formuário com sucesso usando um comando customizado', () => {
    const user = {
      name: 'Eduardo',
      lastName: 'Crepaldi',
      email: 'edu@teste.com',
      areaText: 'Meu primeiro teste automatizado no curso de Cypress com Walmlyr '
    }
    cy.fillMandatoryFieldsAndSubmit(user)
    cy.get('.success').should('be.visible')
  })

  it('seleciona um produto (YouTube) por seu texto', () => {
    cy.get('#product')
      .select('YouTube')
      .should('have.value', 'youtube')
  })

  it('seleciona um produto (Mentoria) por seu valor (value)', () => {
    cy.get('#product')
      .select('mentoria')
      .should('have.value', 'mentoria')
  })

  it('seleciona um produto (Blog) por seu índice', () => {
    cy.get('#product')
      .select(1)
      .should('have.value', 'blog')
  })

  it('marca o tipo de atendimento "Feedback"', () => {
    cy.get('input[type="radio"][value="feedback"]')
      .check()
      .should('have.value', 'feedback')
  })

  it('marca cada tipo de atendimento', () => {
    cy.get('input[type="radio"]')
      .should('have.length', 3)
      .each(($radio) => {
        cy.wrap($radio).check()
        cy.wrap($radio).should('be.checked')
      })
  })

  it('marca ambos checkboxes, depois desmarca o último', () => {
    // cy.get('#check input[type="checkbox"]')
    //   .as('checks')
    //   .check()

    // cy.get('@checks')
    //   .each(checkbox =>{
    //     console.log(checkbox)
    //     expect(checkbox[0].checked).to.equal(true)
    //   })
    //   .last()
    //   .uncheck()
    //   .should('be.not.checked')
    cy.get('#check input[type="checkbox"]')
      .check()
      .last()
      .uncheck()
      .should('be.not.checked')
  })

  it('seleciona um arquivo da pasta fixtures', () => {
    cy.get('#file-upload')
      .selectFile('cypress/fixtures/example.json')
      .then((input) =>
        expect(input[0].files[0].name).eq('example.json')
      )
  })

  it('seleciona um arquivo simulando um drag-and-drop', () => {
    cy.get('#file-upload')
      .selectFile('cypress/fixtures/example.json', { action: "drag-drop" })
      .then((input) =>
        expect(input[0].files[0].name).eq('example.json')
      )
  })

  it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
    cy.fixture('example.json').as('samplefile')
    cy.get('#file-upload')
      .selectFile('@samplefile')
      .then((input) =>
        expect(input[0].files[0].name).eq('example.json')
      )
  })

  it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
    cy.get('#privacy a')
      .should('have.attr', 'target', '_blank')
  })

  it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
    cy.get('#privacy a')
      .invoke('removeAttr', 'target')
      .click()

    cy.get('#title')
      .should('have.text', 'CAC TAT - Política de privacidade')
    cy.contains('Talking About Testing').should('be.visible')
  })

})