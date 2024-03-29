describe('Business Management Page ', () => {
    it('should navigate to business management', () => {
        //Start at website
        cy.visit('https://pleasefixme.vercel.app/')
     //   cy.visit('http://localhost:3000/')

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
        cy.wait(500)
        cy.reload()
        cy.get('td').contains('Automation Test')

        //Access the product button for our business
        cy.get('a[href*="/business/offering?name=Automation Test"]').click()
        cy.get('input[name="password"]').type('0/k0t2qZK/Ak')
        cy.get('input[type="submit"]').click()
        cy.get('h1').contains('Edit Automation Test Products')

        //Click on add a new product
        cy.get('a[href*="/business/offering/add?name=Automation Test"]').click()
        cy.get('h1').contains('Add Products for Automation Test')

        //Enter product name and description
        cy.get('input[name="name"]').type('Product 1')
        cy.get('textarea[name="description"]').click()
        cy.get('textarea[name="description"]').type('This is description for Product 1')
        cy.get('input[type="file"]').attachFile('2DS_Attributes.png');
        //   cy.contains('2DS_Attributes.png');
        cy.wait(500)
        cy.get('input[type="submit"]').click()


        //Go back to products page and verify we see our product
        cy.get('a[href*="/business/offering?name=Automation Test"]').click()
        cy.get('input[name="password"]').type('0/k0t2qZK/Ak')
        cy.get('input[type="submit"]').click()
        cy.get('td').contains('Product 1')

        //Go to defects page for Boston University
        //Will need to update once all code gets merged into main
        //cy.get('a[href*="/business"]').click('.btn')
        // cy.get('button[class*="bg-white text-black py-1 px-3 rounded hover:bg-gray-200 cursor-pointer"]').click()
        // cy.get('a[href*="/business/offering?name=Boston University"]').click()
        // cy.get('input[name="password"]').type('0/k0t2qZK/Ak')
        // cy.get('a[href*="/business/offering/defect?offeringName=Zoom&businessName=Boston University"]').click()
        // cy.get('a[href*="/business/offering/defect/view?id=65d320d7b8e8a014ecba4669&businessName=Boston University&offeringName=Zoom"]').click()
        // cy.get("select").select("Won't Fix")
        // cy.get('textarea[name="statusChangeReason"]').click()
        // cy.get('textarea[name="description"]').type('This is my reason')
        // cy.get('input[type="submit"]').click()
        // cy.get('td').contains('Wont Fix').should('exist')
        // cy.get('a[href*="/business"]').click()

        //Edit our product, verify original text and changes are correct, and delete it
        cy.get('a[href*="/business/offering/edit?name=Product 1&businessName=Automation Test"]').click()
        cy.get('h1').contains('Edit Product 1')
        cy.get('textarea[name="description"]').contains('This is description for Product 1')
        cy.get('textarea[name="description"]').click()
        cy.get('textarea[name="description"]').type('{selectall}{backspace}')
        cy.get('textarea[name="description"]').type('This is an update')
        cy.get('input[type="submit"]').click()
        cy.wait(1000)
        cy.get('textarea[name="description"]').contains('This is an update')
        cy.get('img[alt="Please upload an image to see it here"').should('exist');

        //Delete our product and verify it is no longer listed
        cy.get('button[class="bg-white text-black py-2 px-4 rounded hover:bg-gray-200 cursor-pointer"]').contains('Delete').click()
        cy.get('a[href*="/business/offering?name=Automation Test"]').click()
        cy.get('input[name="password"]').type('0/k0t2qZK/Ak')
        cy.get('input[type="submit"]').click()
        cy.get('td').should('not.exist')

        //Go back to business tab
        cy.get('a[href*="/business"]').click()

        //Find the manage link
        cy.get('a[href*="/business/edit?name=Automation Test"]').click()

        //Enter password
        cy.get('input[name="password"]').type('0/k0t2qZK/Ak')

        // Find a link to submit
        cy.get('input[type="submit"]').click()

        //Verify the Business Description we previously entered
        cy.get('h1').contains('Preferences for Automation Test')
        cy.get('textarea[name="description"]').contains('Automation Test Description')

        //Edit Business Description
        cy.get('textarea[name="description"]').click()
        cy.wait(500)
        cy.get('textarea[name="description"]').type('{selectall}{backspace}')
        cy.wait(500)
        cy.get('textarea[name="description"]').type('Automation Test Description Update')
        cy.wait(500)
        cy.get('input[type="submit"]').click()
        cy.wait(500)
        //Verify Update
        cy.get('textarea[name="description"]').contains('Automation Test Description Update')

        //Verify the Contact Person Name we previously entered
        cy.get('input[name="contactName"]').should('have.value', 'Automation First Name')

        //Edit Contact Person Name
        cy.get('input[name="contactName"]').click()
        cy.wait(500)
        cy.get('input[name="contactName"]').type('{selectall}{backspace}')
        cy.wait(500)
        cy.get('input[name="contactName"]').type('Automation First Name Update')
        cy.wait(500)
        cy.get('input[type="submit"]').click()
        //verify Update
        cy.wait(500)
        cy.get('input[name="contactName"]').should('have.value', 'Automation First Name Update')

        //Verify the Contact email address we previously entered
        cy.get('input[name="contactEmail"]').should('have.value', 'Automation@test.com')
        cy.wait(500)

        //Edit Contact email address
        cy.get('input[name="contactEmail"]').click()
        cy.get('input[name="contactEmail"]').type('{selectall}{backspace}')
        cy.wait(500)
        cy.get('input[name="contactEmail"]').type('AutomationUPDATED@test.com')
        cy.wait(500)
        cy.get('input[type="submit"]').click()
        //verify Update
        cy.wait(500)
        cy.get('input[name="contactEmail"]').should('have.value', 'AutomationUPDATED@test.com')

        //Verify the Phone Number we previously entered
        cy.get('input[name="contactPhone"]').should('have.value', '0000000000')

        //Edit Contact phone number
        cy.get('input[name="contactPhone"]').click()
        cy.get('input[name="contactPhone"]').type('{selectall}{backspace}')
        cy.wait(500)
        cy.get('input[name="contactPhone"]').type('1111111111')
        cy.wait(500)
        cy.get('input[type="submit"]').click()
        //verify Update
        cy.wait(500)
        cy.get('input[name="contactPhone"]').should('have.value', '1111111111')

        //Delete Business
        cy.get('button[class="bg-white text-black py-2 px-4 rounded hover:bg-gray-200 cursor-pointer"]').contains('Delete').click()

        //Click on buinesss link to go back to "Manage a Business" screen
        cy.get('a[href*="/business"]').click()

        //Verify our business is no longer listed
        cy.reload()
        cy.get('td').contains('Automation Test').should('not.exist')
    })
})