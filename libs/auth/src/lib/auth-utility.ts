import { AuthAppStateModel, AuthUserStateModel } from '@libs/auth/src';

export const getDateWithSecondsOffset = (offset: number, date: Date = new Date()): Date => {
  const modifiedDate = new Date(date); // do not mutate the original object!
  modifiedDate.setSeconds(date.getSeconds() + offset);
  return modifiedDate;
};

// should be valid for at least another 30 seconds
export const isTokenValid = (appOrUser: AuthAppStateModel | AuthUserStateModel): boolean => {
  return !!appOrUser && !!appOrUser.accessToken && !!appOrUser.expiration
    && new Date(appOrUser.expiration) > getDateWithSecondsOffset(30);
};
