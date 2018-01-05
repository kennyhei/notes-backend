const palindrom = require('../utils/for_testing').palindrom
const expect = require('chai').expect

describe('palindrom', () => {
    it('of a', () => {
      const result = palindrom('a')

      expect(result).to.equal('a')
    })

    it('of react', () => {
      const result = palindrom('react')

      expect(result).to.equal('tcaer')
    })

    it('of saippuakauppias', () => {
      const result = palindrom('saippuakauppias')

      expect(result).to.equal('saippuakauppias')
    })
})
