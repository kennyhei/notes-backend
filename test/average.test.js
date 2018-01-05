const average = require('../utils/for_testing').average
const expect = require('chai').expect

describe('average', () => {

    it('of one value is the value itself', () => {
        expect(average([1])).to.equal(1)
    })
  
    it('of many is caclulated right', () => {
        expect(average([1, 2, 3, 4, 5, 6])).to.equal(3.5)
    })
  
    it('of empty array is zero', () => {
        expect(average([])).to.equal(0)
    })
  
})