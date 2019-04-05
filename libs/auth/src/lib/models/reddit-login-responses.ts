export interface AppLoginResponse {
  access_token: string;
  token_type: 'bearer';
  device_id: string;
  expires_in: number;
  scope: string;
}

export interface UserLoginRedirectData {
  access_token?: string;
  token_type?: string;
  state?: string;
  expires_in?: string;
  scope?: string;
}
