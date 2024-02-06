describe('Business Management Page ', () => {
    it('should navigate to business management', () => {
        //Start at website
        cy.visit('https://pleasefixme.vercel.app/')

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
        cy.get('input[name="name"]').type('Automation Test')

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

        //Wait for JavaScript pop up to be handled
        cy.wait(500)

        //Click on buinesss link to go back to "Manage a Business" screen
        cy.get('a[href*="/business"]').click()

        //We should have a line with our new business
        cy.get('td').contains('Automation Test')

        //Find the manage link
        cy.get('a[href*="/business/edit?name=Automation Test"]').click()

        //Enter password
        cy.get('input[name="password"]').type('0/k0t2qZK/Ak')

        // Find a link to submit
        cy.get('input[type="submit"]').click()

        //Verify the Business Description we previously entered
        cy.get('textarea[name="description"]').contains('Automation Test Description')

        //Edit Business Description
        cy.get('textarea[name="description"]').type('{selectall}{backspace}')
        cy.get('textarea[name="description"]').type('Automation Test Description Update')
        cy.get('input[type="submit"]').click()
        cy.wait(500)
        //Verify Update
        cy.get('textarea[name="description"]').contains('Automation Test Description Update')

        //Verify the Contact Person Name we previously entered
        cy.get('input[name="contactName"]').should('have.value', 'Automation First Name')

        //Edit Contact Person Name
        cy.get('input[name="contactName"]').type('{selectall}{backspace}')
        cy.get('input[name="contactName"]').type('Automation First Name Update')
        cy.get('input[type="submit"]').click()
        //verify Update
        cy.wait(500)
        cy.get('input[name="contactName"]').should('have.value', 'Automation First Name Update')

        //Verify the Contact email address we previously entered
        cy.get('input[name="contactEmail"]').should('have.value', 'Automation@test.com')

        //Edit Contact email address
        cy.get('input[name="contactEmail"]').type('{selectall}{backspace}')
        cy.get('input[name="contactEmail"]').type('AutomationUPDATED@test.com')
        cy.get('input[type="submit"]').click()
        //verify Update
        cy.wait(500)
        cy.get('input[name="contactEmail"]').should('have.value', 'AutomationUPDATED@test.com')

        //Verify the Phone Number we previously entered
        cy.get('input[name="contactPhone"]').should('have.value', '0000000000')

        //Edit Contact phone number
        cy.get('input[name="contactPhone"]').type('{selectall}{backspace}')
        cy.get('input[name="contactPhone"]').type('1111111111')
        cy.get('input[type="submit"]').click()
        //verify Update
        cy.wait(500)
        cy.get('input[name="contactPhone"]').should('have.value', '1111111111')

        //Delete Business
        cy.get('button[class="bg-white text-black py-2 px-4 rounded hover:bg-gray-200 cursor-pointer"]').contains('Delete').click()

        //Click on buinesss link to go back to "Manage a Business" screen
        cy.get('a[href*="/business"]').click()

        //Verify our business is no longer listed
        cy.get('td').contains('Automation Test').should('not.exist')
    })
})