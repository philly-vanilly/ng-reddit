import { commonGlobalConstants, redditAuthConfigForLocalhost, redditEndpoints } from './environment-defaults';

export const environment = {
  ...commonGlobalConstants,
  ...redditAuthConfigForLocalhost,
  ...redditEndpoints,
  production: false,
  useAnimations: true,
  hmr: true
};
