describe("find text of an attribute in Cypress ", () => {

    it("Alias - Using Wrap Command", () => {
        cy.visit("https://www.linkedin.com/")
        cy.get('[data-test-id="hero__headline"]').then($value => {
            const textValue = $value.text()
            cy.wrap(textValue).as('wrapValue')
        })
    })


    it("Print Value - ALias => Wrap - Command ", function () {
        cy.log("===== Print Value Uisng Wrap Command ==== ", this.wrapValue)
    })
})