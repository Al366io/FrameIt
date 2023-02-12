import generateRandomString from './helpers';

describe('Helpers', () => {
  describe('Check generateRandomString function', () => {
    test('Should generate a random string of the given length', () => {
      expect(generateRandomString(3).length).toBe(3);
      expect(generateRandomString(0).length).toBe(0);
      expect(generateRandomString(50).length).toBe(50);
    });
    test('Should return unique strings', () => {
      expect(generateRandomString(5)).not.toBe(generateRandomString(5));
      expect(generateRandomString(5)).not.toBe(generateRandomString(5));
      expect(generateRandomString(25)).not.toBe(generateRandomString(25));
      expect(generateRandomString(25)).not.toBe(generateRandomString(25));
    });
    test('Should throw when called with  NaN', () => {
      expect(() => {
        generateRandomString(NaN);
      }).toThrowError();
    });
  });
});
