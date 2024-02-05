describe('Business Management', () => {
    it('should navigate to business management', () => {
        //Start at website
        cy.visit('http://localhost:3000/')

        // Find a link with an href attribute containing "Business Management" and click it
        cy.get('a[href*="/business"]').click()

        // The new url should include "/business"
        cy.url().should('include', '/business')

        // The new page should contain an h1 with "Manage a Business"
        cy.get('h1').contains('Manage a Business')

        // Find a link with an href attribute containing "Register a New Business" and click it
        cy.get('a[href*="/business/register"]').click()

        // The new url should include "/register"
        cy.url().should('include', '/register')

        // Find the first field to enter business name
        cy.get('input[name="name"]').type('Automation Test3')

        // Find the second field to enter business description
        cy.get('textarea[name="description"]').type('Automation Test Description')

        // Find the third field to enter contact person name
        cy.get('input[name="contactName"]').type('Automation First Name')

        // Find the fourth field to enter contact email address
        cy.get('input[name="contactEmail"]').type('Automation@test.com')

        // Find the fifth field to enter contact phone number
        cy.get('input[name="contactPhone"]').type('0000000000')

        // Find a link to submit
        cy.get('input[type="submit"]').click()

        cy.wait(500)

      //  cy.on('window:alert')
       // cy.get('window:alert').click
      //  cy.get()




        // Find a link with an href attribute containing "Go back to businesses" and click it
        cy.get('a[href*="/business"]').click()

//         const alertShown = cy.stub().as("alertShown")
//         cy.on ('window:alert', alertShown)
//
//         cy.contains("button", "OK").click()
//
// // By using get, we ensure this will be retried if the checkbox has
// // not been called yet.
//         cy.get("@alertShown").should("have.been.calledOnceWith", "I am an alert box!")
//      //   document.querySelector("body > main > div > div > form > label:nth-child(1) > input")


    })
})


