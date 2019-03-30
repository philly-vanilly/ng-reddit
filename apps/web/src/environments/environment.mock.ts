import { commonGlobalConstants, redditAuthConfigForLocalhost, redditEndpoints } from './environment-defaults';

export const environment = {
  ...commonGlobalConstants,
  ...redditAuthConfigForLocalhost,
  ...redditEndpoints,
  name: 'mock',
  production: false,
  useAnimations: false,
  hmr: false
};
