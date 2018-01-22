const palindrom = require('../utils/for_testing').palindrom

describe('palindrom', () => {
    test('of a', () => {
        const result = palindrom('a')

        expect(result).toBe('a')
    })

    test('of react', () => {
        const result = palindrom('react')

        expect(result).toBe('tcaer')
    })

    test('of saippuakauppias', () => {
        const result = palindrom('saippuakauppias')

        expect(result).toBe('saippuakauppias')
    })
})
