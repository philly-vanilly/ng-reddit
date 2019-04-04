import { AuthAppStateModel, AuthUserStateModel, getExpirationDateFromAuthData } from '@libs/auth/src';
import { getDateWithSecondsOffset, isTokenValid } from '@libs/auth/src/lib/auth-utility';

describe('InitialAuthService', () => {
  describe('getExpirationDateFromAuthData', () => {
    // as date: '2019-04-03T21:17:46.932Z'
    const expirationDateBase64Valid = 'MjAxOS0wNC0wM1QyMToxNzo0Ni45MzJa';
    const expirationInSecondsStringValid = '3600';

    it('should get right expiration date', () => {
      const expectedExpirationDateString = '2019-04-03T22:17:46.932Z'; // +1 hour

      const result: Date = getExpirationDateFromAuthData(expirationDateBase64Valid, expirationInSecondsStringValid);

      expect(result.toJSON()).toBe(expectedExpirationDateString);
    });

    it('should throw error on undefined state', () => {
      const expirationDateBase64 = undefined;
      let error: Error;

      try {
        getExpirationDateFromAuthData(expirationDateBase64, expirationInSecondsStringValid);
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
      expect(error.name).toBe('InvalidCharacterError');
    });

    it('should throw error on non-base64 state', () => {
      const expirationDateBase64 = 'non_base_64';
      let error: Error;

      try {
        getExpirationDateFromAuthData(expirationDateBase64, expirationInSecondsStringValid);
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
      expect(error.name).toBe('InvalidCharacterError');
    });

    it('should throw error on not a valid date', () => {
      const expirationDateBase64 = btoa('anything');
      let error: Error;

      try {
        getExpirationDateFromAuthData(expirationDateBase64, expirationInSecondsStringValid);
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
      expect(error.message.startsWith('state does not contain a valid date')).toBeTruthy();
    });

    it('should throw error on undefined expiration', () => {
      const expirationInSecondsString = undefined;
      let error: Error;

      try {
        getExpirationDateFromAuthData(expirationDateBase64Valid, expirationInSecondsString);
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
      expect(error.message.startsWith('expires_in is not a valid number')).toBeTruthy();
    });

    it('should throw error on non-positive expiration', () => {
      const expirationInSecondsString = '0';
      let error: Error;

      try {
        getExpirationDateFromAuthData(expirationDateBase64Valid, expirationInSecondsString);
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
      expect(error.message.startsWith('expires_in is not a valid number')).toBeTruthy();
    });
  });

  describe('hashDataToKeyValuePairs', () => {
    it('should throw error on non-positive expiration', () => {

    });
  });
});
