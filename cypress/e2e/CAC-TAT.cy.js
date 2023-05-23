/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', () => {
  const THREE_SECONDS_IN_MS = 3000
  beforeEach(() => {
    cy.visit('./src/index.html')
  })

  it('verifica o título da aplicação', () => {
    cy.title().should('eq', 'Central de Atendimento ao Cliente TAT')
  })

  it('preenche os campos obrigatórios e envia o formulário', () => {
    cy.clock()
    cy.get('#firstName').type('Eduardo')
    cy.get('#lastName').type('Crepaldi', { log: false })
    cy.get('#email').type('eduardo@teste.com')
    cy.get('#open-text-area').type('Meu primeiro teste automatizado no curso de Cypress com Walmlyr ', { delay: 0 })
    cy.get('button[type="submit"]').click()
    cy.get('.success').should('be.visible')
    cy.tick(THREE_SECONDS_IN_MS)
    cy.get('.success').should('be.not.visible')
  })

  it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
    cy.clock()
    cy.get('#firstName').type('Eduardo')
    cy.get('#lastName').type('Crepaldi')
    cy.get('#email').type('eduardo@falta')
    cy.get('#open-text-area').type('Meu primeiro teste automatizado no curso de Cypress com Walmlyr ', { delay: 0 })
    cy.get('button[type="submit"]').click()
    cy.get('.error').should('be.visible')
    cy.tick(THREE_SECONDS_IN_MS)
    cy.get('.error').should('be.not.visible')
  })

  it('verifica se o campo telefone só aceita numero', () => {
    cy.get('#phone')
      .type('Eduardo')
      .should('have.value', '')
      .type('!@#$%%(*()*(')
      .should('have.value', '')
  })

  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
    cy.clock()
    cy.get('#firstName').type('Eduardo')
    cy.get('#lastName').type('Crepaldi')
    cy.get('#email').type('eduardo@teste.com')
    cy.get('#open-text-area').type('Meu primeiro teste automatizado no curso de Cypress com Walmlyr ', { delay: 0 })
    cy.get('#phone-checkbox').check()
    cy.get('button[type="submit"]').click()
    cy.get('span[class="phone-label-span required-mark"]').should('be.visible')
    cy.get('.error').should('be.visible')
    cy.tick(THREE_SECONDS_IN_MS)
    cy.get('.error').should('be.not.visible')  })

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
    cy.clock()
    cy.get('button[type="submit"]').click()
    cy.get('.error').should('be.visible')
    cy.tick(THREE_SECONDS_IN_MS)
    cy.get('.error').should('be.not.visible')
  })

  //LODASH => EXECUTANDO 3 VEZES O MESMO TESTE
  Cypress._.times(3, ()=> {
    it('envia o formuário com sucesso usando um comando customizado', () => {
      const user = {
        name: 'Eduardo',
        lastName: 'Crepaldi',
        email: 'edu@teste.com',
        areaText: 'Meu primeiro teste automatizado no curso de Cypress com Walmlyr '
      }
      cy.clock()//Parando o relogio do navegador
      cy.fillMandatoryFieldsAndSubmit(user)
      cy.get('.success').should('be.visible')
      cy.tick(THREE_SECONDS_IN_MS)// Passando 3seg o relogio do navegador, neste caso o toggle não estará mais aparecendo
      cy.get('.success').should('be.not.visible')
    })
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


  it('exibe e esconde as mensagens de sucesso e erro usando o .invoke', () => {
    cy.get('.success')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Mensagem enviada com sucesso.')
      .invoke('hide')
      .should('not.be.visible')

    cy.get('.error')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Valide os campos obrigatórios!')
      .invoke('hide')
      .should('not.be.visible')
  })

  it('preenche a area de texto usando o comando invoke', ()=>{
    const bigString = Cypress._.repeat("Eduardo 26 anos", 5)
    cy.get('#open-text-area')
      .invoke('val', bigString)
      .should('have.value', bigString)

  })

  it('faz uma requisição HTTP', ()=>{
    cy.request('GET','https://cac-tat.s3.eu-central-1.amazonaws.com/index.html',)
      .then((response) =>{
        const {status, statusText, body} = response
        expect(status).eql(200)
        expect(statusText).eql('OKTESTE')
        expect(body).contains('CAC TAT')
      })
  })

  it('encontrar o gato escondido no site', ()=>{
    cy.get('#cat')
      .invoke('show')
      .should('be.visible')
  })
//testando pull request
})