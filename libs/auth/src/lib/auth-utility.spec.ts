import { AuthAppStateModel, AuthUserStateModel } from '@libs/auth/src';
import { getDateWithSecondsOffset, isTokenValid } from '@libs/auth/src/lib/auth-utility';

describe('AuthUtility', () => {
  describe('getDateWithSecondsOffset', () => {
    it('should return same date-string when no offset', () => {
      const dateString = '2019-04-04T05:26:42.478Z';
      const expectedDate = new Date(dateString);

      const result: string = getDateWithSecondsOffset(0, expectedDate).toJSON();

      expect(result).toBe(dateString);
    });

    it('should return date-string from the past with negative offset', () => {
      const expectedDate = new Date();

      const result: string = getDateWithSecondsOffset(-3600, expectedDate).toJSON();

      expect(Date.parse(result)).toBeLessThan(expectedDate.getTime());
    });

    it('should return date-string from the future with positive offset', () => {
      const expectedDate = new Date();

      const result: string = getDateWithSecondsOffset(3600, expectedDate).toJSON();

      expect(Date.parse(result)).toBeGreaterThan(expectedDate.getTime());
    });

    it('should handle undefined date argument by defaulting to current date', () => {
      const dateNowBeforeMethodExecution = new Date();

      const result: string = getDateWithSecondsOffset(0).toJSON();

      expect(Date.parse(result)).toBeGreaterThanOrEqual(dateNowBeforeMethodExecution.getTime());
    });
  });

  describe('isTokenValid', () => {
    it('should return true when token is valid', () => {
      const token: AuthAppStateModel | AuthUserStateModel = {
        accessToken: 'anything',
        expiration: getDateWithSecondsOffset(3600).toJSON()
      };

      expect(isTokenValid(token)).toBeTruthy();
    });

    it('should return false when accessToken is missing', () => {
      const token: AuthAppStateModel | AuthUserStateModel = {
        accessToken: undefined,
        expiration: getDateWithSecondsOffset(3600).toJSON()
      };

      expect(isTokenValid(token)).toBeFalsy();
    });

    it('should return false when expiration is missing', () => {
      const token: AuthAppStateModel | AuthUserStateModel = {
        accessToken: 'anything',
        expiration: undefined
      };

      expect(isTokenValid(token)).toBeFalsy();
    });

    it('should return false when expired', () => {
      const token: AuthAppStateModel | AuthUserStateModel = {
        accessToken: 'anything',
        expiration: getDateWithSecondsOffset(-3600).toJSON()
      };

      expect(isTokenValid(token)).toBeFalsy();
    });
  });
});

