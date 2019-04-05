export interface AppLoginResponse {
  access_token: string;
  token_type: 'bearer';
  device_id: string;
  expires_in: number;
  scope: string;
}
