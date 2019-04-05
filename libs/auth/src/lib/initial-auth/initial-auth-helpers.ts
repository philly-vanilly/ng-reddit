import { getDateWithSecondsOffset } from '@libs/auth/src/lib/auth-utility';
import { UserLoginRedirectData } from '@libs/auth/src/lib/models/reddit-login-responses';

export const requestIsALoginRedirect = (savedState, hashData): boolean =>
  savedState && hashData && hashData.length > 1; // > 1 because the char # is also included

export const getAndDeleteTokenFromStorage = (tokenID: string): string => {
  const token: string = sessionStorage.getItem(tokenID);
  sessionStorage.removeItem(tokenID);
  return token;
};

export const hashDataToKeyValuePairs = (hashData: string): UserLoginRedirectData | undefined => {
  const hashDataWithoutHash = hashData.replace(/#/g, '');
  const result = {};
  hashDataWithoutHash.split('&').forEach(pairString => {
    const keyValuePair: string[] = pairString.split('=');
    if (keyValuePair.length === 2) {
      result[keyValuePair[0]] = keyValuePair[1];
    }
  });
  const requiredProps = ['access_token', 'token_type', 'state', 'expires_in', 'scope'];
  return requiredProps.every(key => result[key]) && Object.keys(result).every(key => requiredProps.includes(key)) ? result : undefined;
};

export const getExpirationDateFromAuthData = (state: string | undefined, expires_in: string | undefined): Date => {
  const expiration: Date = new Date(atob(state));
  if (isNaN(expiration.getSeconds())) {
    throw new Error(`state does not contain a valid date. state = ${atob(state)}`);
  }
  const expiresInNumber: number = Number(expires_in);
  if (isNaN(expiresInNumber) || expiresInNumber <= 0) {
    throw new Error(`expires_in is not a valid number. expires_in = ${expires_in}`);
  }
  return getDateWithSecondsOffset(expiresInNumber, expiration);
};
