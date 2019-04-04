import { AuthAppStateModel, AuthUserStateModel } from '@libs/auth/src';

export const isTokenValid = (appOrUser: AuthAppStateModel | AuthUserStateModel): boolean => {
  return !!appOrUser && !!appOrUser.accessToken && !!appOrUser.expiration && Date.parse(appOrUser.expiration) > new Date().getTime();
};
export const getDateWithSecondsOffset = (offset: number, date: Date = new Date()): Date => {
  const modifiedDate = new Date(date); // do not mutate the original object!
  modifiedDate.setSeconds(date.getSeconds() + offset);
  return modifiedDate;
};
