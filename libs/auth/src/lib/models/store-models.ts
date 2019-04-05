export interface AuthUserStateModel {
  accessToken: string;
  expiration: string;
}

export interface AuthAppStateModel {
  accessToken: string;
  expiration: string;
  deviceId: string;
}

export interface AuthStateModel {
  user?: AuthUserStateModel;
  app?: AuthAppStateModel;
}
